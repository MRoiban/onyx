import * as React from "react";
import { describe, expect, it, mock } from "bun:test";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { Listbox, useListbox } from "../src/components/listbox";
import { Tree, useTree } from "../src/components/tree";
import { Tabs, TabsList, TabsTrigger, TabBadge } from "../src/components/tabs";
import { useCarousel } from "../src/components/carousel";
import { usePagination } from "../src/components/pagination";
import { useSplitView } from "../src/components/split-view";
import { renderToString } from "react-dom/server";
import { readFileSync } from "node:fs";
const items = [1, 2, 3, 4, 5];
const getKey = (item: number) => item;
const getChildren = () => undefined;

describe("fix E collection regressions", () => {
  for (const kind of ["listbox", "tree"] as const) {
    it(`${kind} anchors Shift+Up at focus after End`, () => {
      render(kind === "tree" ? <Tree items={items} getKey={getKey} getChildren={getChildren} selectionMode="multiple" /> : <Listbox items={items} getKey={getKey} selectionMode="multiple" />);
      const root = screen.getByRole(kind);
      fireEvent.keyDown(root, { key: "End" });
      fireEvent.keyDown(root, { key: "ArrowUp", shiftKey: true });
      expect(screen.getAllByRole(kind === "tree" ? "treeitem" : "option").filter(el => el.getAttribute("aria-selected") === "true").map(el => el.textContent)).toEqual(["4", "5"]);
    });
    it(`${kind} custom row height controls CSS geometry`, () => {
      render(kind === "tree" ? <Tree items={items} getKey={getKey} getChildren={getChildren} virtualized rowHeight={37} /> : <Listbox items={items} getKey={getKey} virtualized rowHeight={37} />);
      expect((screen.getByRole(kind) as HTMLElement).style.getPropertyValue("--onyx-row-height")).toBe("37px");
      const css = readFileSync("src/styles/collections.css", "utf8");
      expect(css).toContain("height: var(--onyx-row-height)");
      expect(css).toContain("min-height: var(--onyx-row-height)");
    });
  }
  it("getItemProps uses linear getKey calls for 12,480 rows", () => {
    const rows = Array.from({ length: 12480 }, (_, i) => i);
    let calls = 0;
    const key = (i: number) => { calls++; return i; };
    const { result } = renderHook(() => useListbox({ items: rows, getKey: key }));
    for (const i of rows) expect(result.current.getItemProps(i)["aria-posinset"]).toBe(i + 1);
    expect(calls).toBeLessThanOrEqual(rows.length * 3);
  });
  it("typeahead refinement keeps matching focus and repeated characters cycle", () => {
    render(<Listbox items={["Zero", "Apple", "Apricot"]} getKey={x => x} getText={x => x} />);
    const root = screen.getByRole("listbox");
    fireEvent.keyDown(root, { key: "a" });
    fireEvent.keyDown(root, { key: "p" });
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("data-focused")).toBe("true");
  });
  it("typeahead repeated character starts after current match", () => {
    render(<Listbox items={["Apple", "Apricot"]} getKey={x => x} getText={x => x} />);
    const root = screen.getByRole("listbox");
    fireEvent.keyDown(root, { key: "a" });
    expect(screen.getByRole("option", { name: "Apricot" }).getAttribute("data-focused")).toBe("true");
    fireEvent.keyDown(root, { key: "a" });
    expect(screen.getByRole("option", { name: "Apple" }).getAttribute("data-focused")).toBe("true");
  });
  it("tree keyboard cut paste supports all positions and Escape with polite results", () => {
    const move = mock(() => {});
    render(<Tree items={items} getKey={getKey} getChildren={getChildren} onMoveItem={move} />);
    const root = screen.getByRole("tree");
    for (const [shiftKey, altKey, position] of [[false, false, "inside"], [true, false, "before"], [true, true, "after"]] as const) {
      fireEvent.keyDown(root, { key: "Home" });
      fireEvent.keyDown(root, { key: "x", ctrlKey: true });
      fireEvent.keyDown(root, { key: "End" });
      fireEvent.keyDown(root, { key: "v", ctrlKey: true, shiftKey, altKey });
      expect(move).toHaveBeenLastCalledWith([1], 5, position);
      expect(screen.getByRole("status").textContent).toContain(`Moved 1 item ${position} 5`);
    }
    fireEvent.keyDown(root, { key: "x", metaKey: true });
    fireEvent.keyDown(root, { key: "Escape" });
    expect(screen.getByRole("status").textContent).toBe("Move cancelled.");
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
  });
  it("tree headless moves and DnD share canMove rejection", () => {
    const move = mock(() => {});
    const { result } = renderHook(() => useTree({ items, getKey, getChildren, onMoveItem: move, canMove: () => false }));
    act(() => { expect(result.current.moveItem([1], 5, "after")).toBe(false); });
    const transfer = { setData() {} };
    result.current.getDragProps(result.current.rows[0]).onDragStart({ dataTransfer: transfer } as any);
    const preventDefault = mock(() => {});
    act(() => result.current.getDragProps(result.current.rows[4]).onDragOver({ currentTarget: { getBoundingClientRect: () => ({ top: 0, height: 20 }) }, clientY: 10, preventDefault } as any));
    expect(preventDefault).not.toHaveBeenCalled();
    expect(move).not.toHaveBeenCalled();
  });
  it("tabs have one roving stop and return to controlled selection on exit", () => {
    const content = (value: string) => <><Tabs value={value}><TabsList>{["A", "B", "C"].map(v => <TabsTrigger key={v} value={v}>{v}</TabsTrigger>)}</TabsList></Tabs><button>Outside</button></>;
    const view = render(content("A"));
    act(() => screen.getByRole("tab", { name: "A" }).focus());
    fireEvent.keyDown(screen.getByRole("tab", { name: "A" }), { key: "ArrowRight" });
    view.rerender(content("C"));
    expect(screen.getAllByRole("tab").filter(el => el.tabIndex === 0).map(el => el.textContent)).toEqual(["B"]);
    act(() => screen.getByRole("button", { name: "Outside" }).focus());
    expect(screen.getAllByRole("tab").filter(el => el.tabIndex === 0).map(el => el.textContent)).toEqual(["C"]);
  });
  it("controlled carousel scrolls only to accepted index", () => {
    const scrollTo = mock(() => {});
    const change = mock(() => {});
    const { result, rerender } = renderHook(({ index }) => useCarousel({ count: 3, index, onIndexChange: change }), { initialProps: { index: 0 } });
    const track = document.createElement("div");
    for (let i = 0; i < 3; i++) { const slide = document.createElement("div"); Object.defineProperty(slide, "offsetLeft", { value: i * 100 }); track.append(slide); }
    track.scrollTo = scrollTo;
    (result.current.trackRef as React.MutableRefObject<HTMLDivElement>).current = track;
    act(() => result.current.goTo(2));
    expect(change).toHaveBeenCalledWith(2);
    expect(scrollTo).not.toHaveBeenCalled();
    rerender({ index: 1 });
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 100, behavior: "smooth" });
  });
  it("SplitView tolerates throwing localStorage availability getter", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("denied"); } });
    try { const { result } = renderHook(() => useSplitView({ autoSaveId: "blocked", defaultSizes: [50, 50] })); expect(result.current.sizes).toEqual([50, 50]); }
    finally { if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor); else delete (globalThis as any).localStorage; }
  });
  it("SplitView renders on the server without storage", () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
    delete (globalThis as any).localStorage;
    function ServerSplit() { const model = useSplitView({ autoSaveId: "ssr", defaultSizes: [40, 60] }); return <span>{model.sizes.join(",")}</span>; }
    try { expect(renderToString(<ServerSplit />)).toContain("40,60"); }
    finally { if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor); }
  });
  it("tree row props avoid scanning the collection for positions", () => {
    const rows = Array.from({ length: 12480 }, (_, i) => i);
    let calls = 0;
    const { result } = renderHook(() => useTree({ items: rows, getKey: (i: number) => { calls++; return i; }, getChildren }));
    for (const row of result.current.rows) expect(result.current.getItemProps(row)["aria-posinset"]).toBe(row.posInSet);
    expect(calls).toBeLessThanOrEqual(rows.length * 3);
  });
  it("pagination normalizes initial controlled values and setPage", () => {
    for (const [input, output] of [[2.5, 2], [NaN, 1], [0, 1], [99, 5]]) {
      const { result, unmount } = renderHook(() => usePagination({ totalPages: 5, page: input }));
      expect(result.current.page).toBe(output); unmount();
    }
    const { result } = renderHook(() => usePagination({ totalPages: 5, defaultPage: 2.5 }));
    expect(result.current.page).toBe(2);
    for (const [input, output] of [[NaN, 1], [2.5, 2], [0, 1], [99, 5]]) { act(() => result.current.setPage(input)); expect(result.current.page).toBe(output); }
  });
  it("carousel dot targets use nonoverlapping 24 token hit areas", () => {
    const css = readFileSync("src/styles/collections.css", "utf8");
    expect(css).toContain(':where([data-slot="carousel-dot"])::after');
    expect(css).toContain("width: max(100%, var(--onyx-space-6))");
    expect(css).toContain("gap: var(--onyx-space-6)");
  });
  it("TabBadge uses the density-aware type token", () => {
    const { container } = render(<TabBadge>3</TabBadge>);
    expect(container.firstElementChild?.className).toContain("text-[length:var(--onyx-text-xs)]");
  });
});
