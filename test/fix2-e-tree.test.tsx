import * as React from "react";
import { describe, expect, it, mock } from "bun:test";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { Tree, useTree } from "../src/components/tree";

const items = ["Source", "Target"];
const options = { items, getKey: (item: string) => item, getText: (item: string) => item, getChildren: () => undefined };

describe("R13 tree move alternatives", () => {
  it("keyboard paste respects canDrop false for every position", () => {
    const move = mock(() => {});
    const canDrop = mock(() => false);
    render(<Tree {...options} canDrop={canDrop} onMoveItem={move} />);
    const tree = screen.getByRole("tree");
    fireEvent.keyDown(tree, { key: "x", ctrlKey: true });
    fireEvent.keyDown(tree, { key: "End" });
    for (const [shiftKey, altKey] of [[false, false], [true, false], [true, true]]) {
      fireEvent.keyDown(tree, { key: "v", ctrlKey: true, shiftKey, altKey });
      expect(screen.getByRole("status").textContent).toBe("Move unavailable at this target.");
    }
    expect(canDrop).toHaveBeenCalledTimes(3);
    expect(move).not.toHaveBeenCalled();
  });
  it("headless moveItem respects canDrop false without dispatch", () => {
    const move = mock(() => {});
    const { result } = renderHook(() => useTree({ ...options, canDrop: () => false, onMoveItem: move }));
    for (const position of ["before", "inside", "after"] as const) {
      act(() => expect(result.current.moveItem(["Source"], "Target", position)).toBe(false));
    }
    expect(move).not.toHaveBeenCalled();
  });
});

for (const position of ["before", "inside", "after"] as const) {
  it(`R13 pointer Cut and Paste ${position} dispatch and announce without dragging`, () => {
    const move = mock(() => {});
    render(<Tree {...options} onMoveItem={move} selectionMode="multiple" />);
    fireEvent.click(screen.getByRole("treeitem", { name: "Source" }));
    fireEvent.click(screen.getByRole("button", { name: "Cut" }));
    expect(screen.getByRole("status").textContent).toContain("1 item marked for move");
    fireEvent.click(screen.getByRole("treeitem", { name: "Target" }));
    fireEvent.click(screen.getByRole("button", { name: `Paste ${position}` }));
    expect(move).toHaveBeenCalledWith(["Source"], "Target", position);
    expect(screen.getByRole("status").textContent).toBe(`Moved 1 item ${position} Target.`);
    expect(screen.getByRole("status").getAttribute("aria-live")).toBe("polite");
    expect(screen.getByRole("button", { name: `Paste ${position}` }).hasAttribute("disabled")).toBe(true);
  });
}

for (const gate of ["canDrop", "canMove"] as const) {
  it(`R13 pointer and headless paste respect ${gate} and retain cut for retry`, () => {
    const move = mock(() => {});
    render(<Tree {...options} onMoveItem={move} {...{ [gate]: () => false }} />);
    fireEvent.click(screen.getByRole("button", { name: "Cut" }));
    fireEvent.click(screen.getByRole("treeitem", { name: "Target" }));
    fireEvent.click(screen.getByRole("button", { name: "Paste after" }));
    expect(move).not.toHaveBeenCalled();
    expect(screen.getByRole("status").textContent).toBe("Move unavailable at this target.");
    fireEvent.click(screen.getByRole("button", { name: "Cancel move" }));
    expect(screen.getByRole("status").textContent).toBe("Move cancelled.");
    const { result } = renderHook(() => useTree({ ...options, onMoveItem: move, [gate]: () => false }));
    act(() => expect(result.current.cutItem("Source")).toBe(true));
    act(() => expect(result.current.pasteItem("Target", "after")).toBe(false));
    expect(result.current.cutKeys).toEqual(["Source"]);
    expect(move).not.toHaveBeenCalled();
  });
}

it("R13 canDrop sees the same source payload for headless and internal DnD moves", () => {
  const move = mock(() => {});
  const canDrop = mock((_target, event: React.DragEvent) => event.dataTransfer.getData("text/plain") === "Source");
  const { result } = renderHook(() => useTree({ ...options, onMoveItem: move, canDrop }));
  act(() => expect(result.current.moveItem(["Source"], "Target", "before")).toBe(true));
  const dataTransfer = new DataTransfer();
  act(() => result.current.getDragProps(result.current.rows[0]).onDragStart({ dataTransfer } as React.DragEvent));
  act(() => result.current.getDragProps(result.current.rows[1]).onDragOver({ dataTransfer, currentTarget: { getBoundingClientRect: () => ({ top: 0, height: 20 }) }, clientY: 10, preventDefault() {} } as unknown as React.DragEvent<HTMLElement>));
  act(() => result.current.getDragProps(result.current.rows[1]).onDrop({ dataTransfer, preventDefault() {} } as React.DragEvent));
  expect(move).toHaveBeenCalledTimes(2);
});

it("R13 cut rejects disabled sources and paste rejects self and descendants", () => {
  const nodes = [{ key: "parent", children: [{ key: "child" }] }, { key: "disabled" }];
  const move = mock(() => {});
  const { result } = renderHook(() => useTree({ items: nodes, getKey: n => n.key, getChildren: n => "children" in n ? n.children : undefined, defaultExpandedKeys: ["parent"], isDisabled: n => n.key === "disabled", onMoveItem: move }));
  act(() => expect(result.current.cutItem("disabled")).toBe(false));
  act(() => expect(result.current.cutItem("parent")).toBe(true));
  for (const target of ["parent", "child", "disabled"]) {
    act(() => expect(result.current.pasteItem(target)).toBe(false));
  }
  expect(move).not.toHaveBeenCalled();
});
