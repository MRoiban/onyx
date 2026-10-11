import * as React from "react";
import { describe, expect, it } from "bun:test";
import {
  act,
  createEvent,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { Listbox, useListbox } from "../src/components/listbox";
import { Tree, flattenTree, useTree } from "../src/components/tree";
import { ResizeHandle } from "../src/components/resize-handle";
import {
  SplitView,
  SplitViewPane,
  normalizeSplitSizes,
  resizeSplitSizes,
} from "../src/components/split-view";
import { Pagination, getPaginationRange } from "../src/components/pagination";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "../src/components/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../src/components/tabs";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "../src/components/table";
import {
  WorkbenchSidebar,
  SidebarProvider,
  Sidebar,
  SidebarRail,
  useSidebar,
} from "../src/components/sidebar";
import { VirtualList } from "../src/components/virtual-list";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "../src/components/carousel";

const items = [
  { id: "a", name: "Alpha", group: "First" },
  { id: "b", name: "Beta", group: "First" },
  { id: "c", name: "Charlie", group: "Second" },
  { id: "d", name: "Disabled", group: "Second", disabled: true },
  { id: "e", name: "Echo", group: "Second" },
];
const collection = {
  items,
  getKey: (item: (typeof items)[number]) => item.id,
  getText: (item: (typeof items)[number]) => item.name,
  isDisabled: (item: (typeof items)[number]) => !!item.disabled,
};
function selected() {
  return screen
    .getAllByRole("option")
    .filter((el) => el.getAttribute("aria-selected") === "true")
    .map((el) => el.textContent);
}
describe("W3 listbox", () => {
  it("keeps focus separate from single selection, skips disabled and supports Home/End", () => {
    render(
      <Listbox
        {...collection}
        aria-label="Options"
        defaultSelectedKeys={["b"]}
      />,
    );
    const root = screen.getByRole("listbox");
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Beta" }).id,
    );
    fireEvent.keyDown(root, { key: "End" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Echo" }).id,
    );
    expect(selected()).toEqual(["Beta"]);
    fireEvent.keyDown(root, { key: "ArrowUp" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Charlie" }).id,
    );
    fireEvent.keyDown(root, { key: " " });
    expect(selected()).toEqual(["Charlie"]);
    fireEvent.keyDown(root, { key: "Home" });
    fireEvent.keyDown(root, { key: "Enter" });
    expect(selected()).toEqual(["Alpha"]);
    fireEvent.click(screen.getByRole("option", { name: "Disabled" }));
    expect(selected()).toEqual(["Alpha"]);
  });
  it("handles plain click, Shift range, Cmd/Ctrl toggle, Space and select all", () => {
    render(
      <Listbox {...collection} aria-label="Options" selectionMode="multiple" />,
    );
    const root = screen.getByRole("listbox");
    fireEvent.click(screen.getByText("Alpha"));
    fireEvent.click(screen.getByText("Charlie"), { shiftKey: true });
    expect(selected()).toEqual(["Alpha", "Beta", "Charlie"]);
    fireEvent.click(screen.getByText("Beta"), { metaKey: true });
    expect(selected()).toEqual(["Alpha", "Charlie"]);
    fireEvent.click(screen.getByText("Echo"), { ctrlKey: true });
    expect(selected()).toEqual(["Alpha", "Charlie", "Echo"]);
    fireEvent.keyDown(root, { key: " " });
    expect(selected()).toEqual(["Alpha", "Charlie"]);
    fireEvent.keyDown(root, { key: "Home" });
    fireEvent.keyDown(root, { key: "ArrowDown", shiftKey: true });
    expect(selected()).toEqual(["Alpha", "Beta"]);
    fireEvent.keyDown(root, { key: "a", ctrlKey: true });
    expect(selected()).toEqual(["Alpha", "Beta", "Charlie", "Echo"]);
  });
  it("names groups and performs buffered typeahead without selecting", () => {
    render(
      <Listbox
        {...collection}
        aria-label="Options"
        getGroup={(item) => item.group}
      />,
    );
    expect(screen.getByRole("group", { name: "First" })).toBeTruthy();
    const root = screen.getByRole("listbox");
    fireEvent.keyDown(root, { key: "c" });
    fireEvent.keyDown(root, { key: "h" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Charlie" }).id,
    );
    expect(selected()).toEqual([]);
  });
  it("keeps grouped keyboard order consistent with rendered order", () => {
    render(
      <Listbox
        {...collection}
        items={[items[0], items[2], items[1]]}
        getGroup={(item) => item.group}
        aria-label="Ordered groups"
      />,
    );
    const root = screen.getByRole("listbox");
    fireEvent.keyDown(root, { key: "ArrowDown" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Beta" }).id,
    );
  });
  it("allows consecutive headless toggles in the same batch", () => {
    const { result } = renderHook(() =>
      useListbox({ ...collection, selectionMode: "multiple" }),
    );
    act(() => {
      result.current.select("a", { toggle: true });
      result.current.select("b", { toggle: true });
    });
    expect(result.current.selectedKeys).toEqual(["a", "b"]);
  });
  it("exports controlled selection and focus without depending on Onyx markup", () => {
    let changed: readonly (string | number)[] = [];
    const { result } = renderHook(() =>
      useListbox({
        ...collection,
        selectedKeys: ["a"],
        onSelectionChange: (value) => {
          changed = value;
        },
      }),
    );
    act(() => result.current.select("c"));
    expect(changed).toEqual(["c"]);
    expect(result.current.selectedKeys).toEqual(["a"]);
    expect(result.current.focusedKey).toBe("c");
  });
});
interface Node {
  id: string;
  name: string;
  children?: Node[];
  folder?: boolean;
}
const nodes: Node[] = [
  {
    id: "root",
    name: "Root",
    folder: true,
    children: [
      {
        id: "branch",
        name: "Branch",
        folder: true,
        children: [{ id: "leaf", name: "Leaf" }],
      },
      { id: "other", name: "Other" },
    ],
  },
  {
    id: "sibling",
    name: "Sibling",
    folder: true,
    children: [{ id: "last", name: "Last" }],
  },
];
const treeOptions = {
  items: nodes,
  getKey: (item: Node) => item.id,
  getText: (item: Node) => item.name,
  getChildren: (item: Node) => item.children,
  isExpandable: (item: Node) => !!item.folder,
};
describe("W3 tree", () => {
  it("flattens only expanded descendants with complete virtual ARIA positions", () => {
    expect(flattenTree(treeOptions, []).map((row) => row.key)).toEqual([
      "root",
      "sibling",
    ]);
    const rows = flattenTree(treeOptions, ["root", "branch"]);
    expect(rows.map((row) => row.key)).toEqual([
      "root",
      "branch",
      "leaf",
      "other",
      "sibling",
    ]);
    expect(rows[2]).toMatchObject({
      depth: 2,
      parentKey: "branch",
      posInSet: 1,
      setSize: 1,
    });
  });
  it("supports Right/Left, star sibling expansion, Enter, Space selection and typeahead", () => {
    render(
      <Tree {...treeOptions} aria-label="Files" selectionMode="multiple" />,
    );
    const root = screen.getByRole("tree");
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(
      screen
        .getByRole("treeitem", { name: "Root" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("treeitem", { name: "Branch" }).id,
    );
    fireEvent.keyDown(root, { key: "Enter" });
    expect(
      screen
        .getByRole("treeitem", { name: "Branch" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    expect(screen.getByRole("treeitem", { name: "Leaf" })).toBeTruthy();
    fireEvent.keyDown(root, { key: "ArrowRight" });
    fireEvent.keyDown(root, { key: " ", shiftKey: true });
    expect(
      screen
        .getByRole("treeitem", { name: "Leaf" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    fireEvent.keyDown(root, { key: "ArrowLeft" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("treeitem", { name: "Branch" }).id,
    );
    fireEvent.keyDown(root, { key: "ArrowLeft" });
    expect(screen.queryByRole("treeitem", { name: "Leaf" })).toBeNull();
    fireEvent.keyDown(root, { key: "Home" });
    fireEvent.keyDown(root, { key: "*" });
    expect(screen.getByRole("treeitem", { name: "Last" })).toBeTruthy();
    fireEvent.keyDown(root, { key: "o" });
    expect(root.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("treeitem", { name: "Other" }).id,
    );
  });
  it("loads async children, exposes loading state and prevents duplicate requests", async () => {
    let resolve!: (children: readonly Node[]) => void;
    let calls = 0;
    const { result } = renderHook(() =>
      useTree({
        ...treeOptions,
        items: [{ id: "async", name: "Async", folder: true }],
        loadChildren: () => {
          calls++;
          return new Promise<readonly Node[]>((done) => {
            resolve = done;
          });
        },
      }),
    );
    act(() => {
      result.current.expand(result.current.rows[0], true);
      result.current.expand(result.current.rows[0], true);
    });
    expect(result.current.loadingKeys.has("async")).toBe(true);
    await act(async () => {
      await Promise.resolve();
      resolve([{ id: "loaded", name: "Loaded" }]);
      await Promise.resolve();
    });
    expect(calls).toBe(1);
    expect(result.current.rows.map((row) => row.key)).toEqual([
      "async",
      "loaded",
    ]);
    expect(result.current.loadingKeys.size).toBe(0);
  });
  it("isolates rename editing keys and exposes before/inside/after drop callbacks", () => {
    let name = "",
      target = "";
    render(
      <Tree
        {...treeOptions}
        aria-label="Files"
        defaultRenamingKey="root"
        onRename={(_, value) => {
          name = value;
        }}
        renderRename={(item, actions) => (
          <input
            aria-label="Rename"
            defaultValue={item.name}
            onKeyDown={(event) => {
              if (event.key === "Enter")
                actions.commit(event.currentTarget.value);
            }}
          />
        )}
        onDropItem={(value) => {
          target = value.position;
        }}
      />,
    );
    fireEvent.change(screen.getByLabelText("Rename"), {
      target: { value: "New" },
    });
    fireEvent.keyDown(screen.getByLabelText("Rename"), { key: "Enter" });
    expect(name).toBe("New");
    const row = screen.getByRole("treeitem", { name: "Root" });
    const drag = createEvent.dragOver(row);
    Object.defineProperty(drag, "clientY", { value: 0 });
    fireEvent(row, drag);
    expect(row.getAttribute("data-drop-position")).toBe("before");
    fireEvent.drop(row);
    expect(target).toBe("before");
    expect(row.hasAttribute("data-drop-target")).toBe(false);
  });
});
describe("W3 resizing", () => {
  it("reports values and honors keyboard increments, bounds, collapse restore and reset", () => {
    render(
      <ResizeHandle
        aria-label="Sidebar"
        defaultValue={240}
        min={160}
        max={500}
        collapsible
      />,
    );
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-valuenow")).toBe("240");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(separator.getAttribute("aria-valuenow")).toBe("250");
    fireEvent.keyDown(separator, { key: "ArrowLeft", shiftKey: true });
    expect(separator.getAttribute("aria-valuenow")).toBe("200");
    fireEvent.keyDown(separator, { key: "End" });
    expect(separator.getAttribute("aria-valuenow")).toBe("500");
    fireEvent.keyDown(separator, { key: "Enter" });
    expect(separator.getAttribute("aria-valuenow")).toBe("0");
    fireEvent.keyDown(separator, { key: "Enter" });
    expect(separator.getAttribute("aria-valuenow")).toBe("500");
    fireEvent.doubleClick(separator);
    expect(separator.getAttribute("aria-valuenow")).toBe("240");
    fireEvent.keyDown(separator, { key: "Home" });
    expect(separator.getAttribute("aria-valuenow")).toBe("0");
  });
  it("uses Up/Down for horizontal separators and preserves controlled values", () => {
    let value = 0;
    render(
      <ResizeHandle
        orientation="horizontal"
        value={100}
        onValueChange={(next) => {
          value = next;
        }}
        min={50}
        max={200}
      />,
    );
    fireEvent.keyDown(screen.getByRole("separator"), {
      key: "ArrowDown",
      shiftKey: true,
    });
    expect(value).toBe(150);
    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe(
      "100",
    );
  });
  it("resizes adjacent panes with min/max, collapse and snap, retaining total and neighbors", () => {
    const constraints = [
      { minSize: 15, maxSize: 50, collapsible: true, snap: [26] },
      { minSize: 20, maxSize: 80 },
      { minSize: 10 },
    ];
    expect(resizeSplitSizes([26, 52, 22], 0, 99, constraints)).toEqual([
      50, 28, 22,
    ]);
    expect(resizeSplitSizes([26, 52, 22], 0, 5, constraints)).toEqual([
      0, 78, 22,
    ]);
    expect(resizeSplitSizes([26, 52, 22], 0, 26.7, constraints)).toEqual([
      26, 52, 22,
    ]);
    expect(resizeSplitSizes([26, 52, 22], 0, 8, constraints)).toEqual([
      15, 63, 22,
    ]);
    const normalized = normalizeSplitSizes(
      [1, 1, 1],
      [{ minSize: 50 }, {}, {}],
    );
    expect(normalized.reduce((a, b) => a + b)).toBeCloseTo(100);
    expect(normalized[0]).toBe(50);
    for (let value = -100; value <= 200; value++) {
      const next = resizeSplitSizes([26, 52, 22], 0, value, constraints);
      expect(next.reduce((a, b) => a + b)).toBeCloseTo(100);
      expect(next[2]).toBe(22);
      expect(next[1]).toBeGreaterThanOrEqual(20);
      expect(next[1]).toBeLessThanOrEqual(80);
    }
  });
  it("persists split sizes and renders keyboard accessible nested separators", () => {
    localStorage.setItem("onyx:split:w3-test", "[30,70]");
    render(
      <SplitView autoSaveId="w3-test">
        <SplitViewPane minSize={20}>Left</SplitViewPane>
        <SplitViewPane minSize={20}>Right</SplitViewPane>
      </SplitView>,
    );
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-valuenow")).toBe("30");
    fireEvent.keyDown(separator, { key: "Home" });
    expect(separator.getAttribute("aria-valuenow")).toBe("20");
    expect(JSON.parse(localStorage.getItem("onyx:split:w3-test")!)).toEqual([
      20, 80,
    ]);
    localStorage.removeItem("onyx:split:w3-test");
  });
  it("restores a resized sidebar when its existing context toggle reopens it", () => {
    function Toggle() {
      const sidebar = useSidebar();
      return <button onClick={sidebar.toggleSidebar}>Toggle sidebar</button>;
    }
    const view = render(
      <SidebarProvider collapsible="icon">
        <Toggle />
        <Sidebar>
          <SidebarRail defaultWidth={240} />
        </Sidebar>
      </SidebarProvider>,
    );
    const rail = screen.getByRole("separator");
    const sidebar = view.container.querySelector<HTMLElement>(
      "[data-slot=sidebar]",
    )!;
    fireEvent.keyDown(rail, { key: "ArrowRight" });
    expect(sidebar.style.width).toBe("250px");
    fireEvent.keyDown(rail, { key: "Enter" });
    expect(sidebar.getAttribute("data-state")).toBe("collapsed");
    expect(sidebar.style.width).toBe("");
    fireEvent.click(screen.getByRole("button", { name: "Toggle sidebar" }));
    expect(sidebar.getAttribute("data-state")).toBe("expanded");
    expect(sidebar.style.width).toBe("250px");
  });
  it("connects WorkbenchSidebar keyboard resizing to its existing callback", () => {
    let width = 0;
    render(
      <WorkbenchSidebar
        activityBarVisible={false}
        activityItems={[]}
        open
        onOpenChange={() => {}}
        onActivityBarVisibleChange={() => {}}
        sidebarWidth={320}
        sidebarMinWidth={200}
        sidebarMaxWidth={800}
        onSidebarWidthChange={(next) => {
          width = next;
        }}
        environment={{ window: null, document: null }}
      >
        <div>Content</div>
      </WorkbenchSidebar>,
    );
    const rail = screen.getByRole("separator");
    expect(rail.getAttribute("aria-valuenow")).toBe("320");
    fireEvent.keyDown(rail, { key: "ArrowRight" });
    expect(width).toBe(330);
  });
});
describe("W3 structure", () => {
  it("builds ellipses, fills single-page gaps and handles empty or bounded pagination", () => {
    expect(getPaginationRange(5, 20)).toEqual([
      1,
      "ellipsis-start",
      4,
      5,
      6,
      "ellipsis-end",
      20,
    ]);
    expect(getPaginationRange(1, 1)).toEqual([1]);
    expect(getPaginationRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPaginationRange(100, 5)).toEqual([1, "ellipsis-start", 4, 5]);
    expect(getPaginationRange(1, 0)).toEqual([]);
    expect(getPaginationRange(1, Infinity)).toEqual([]);
    render(<Pagination defaultPage={1} totalPages={5} />);
    expect(
      (screen.getByLabelText("Previous page") as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(screen.getByLabelText("Page 2").getAttribute("aria-current")).toBe(
      "page",
    );
  });
  for (const type of ["single", "multiple"] as const)
    it(`supports ${type} accordion ARIA and expansion`, () => {
      render(
        <Accordion type={type}>
          {["a", "b"].map((value) => (
            <AccordionItem key={value} value={value}>
              <AccordionHeader>
                <AccordionTrigger>{value}</AccordionTrigger>
              </AccordionHeader>
              <AccordionContent>{value} content</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>,
      );
      fireEvent.click(screen.getByRole("button", { name: "a" }));
      fireEvent.click(screen.getByRole("button", { name: "b" }));
      expect(
        screen.getByRole("button", { name: "a" }).getAttribute("aria-expanded"),
      ).toBe(type === "single" ? "false" : "true");
      expect(
        screen.getByRole("button", { name: "b" }).getAttribute("aria-expanded"),
      ).toBe("true");
      expect(
        screen.getByRole("button", { name: "b" }).hasAttribute("aria-controls"),
      ).toBe(true);
    });
  it("adds line tab roving focus and connects panel IDs", () => {
    render(
      <Tabs variant="line" defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">A</TabsTrigger>
          <TabsTrigger value="disabled" disabled>
            Disabled
          </TabsTrigger>
          <TabsTrigger value="b">B</TabsTrigger>
        </TabsList>
        <TabsContent value="a">A panel</TabsContent>
        <TabsContent value="b">B panel</TabsContent>
      </Tabs>,
    );
    const a = screen.getByRole("tab", { name: "A" }),
      b = screen.getByRole("tab", { name: "B" });
    a.focus();
    fireEvent.keyDown(a, { key: "ArrowRight" });
    expect(document.activeElement).toBe(b);
    fireEvent.keyDown(b, { key: "Enter" });
    expect(screen.getByRole("tabpanel").textContent).toBe("B panel");
    expect(b.getAttribute("aria-controls")).toBe(
      screen.getByRole("tabpanel").id,
    );
  });
  it("renders sortable header affordance and selected row state without sorting data", () => {
    let calls = 0;
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sort="ascending" onSort={() => calls++}>
              Name
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>File</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("columnheader").getAttribute("aria-sort")).toBe(
      "ascending",
    );
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(calls).toBe(1);
    expect(
      screen.getByRole("row", { name: "File" }).getAttribute("data-selected"),
    ).toBe("true");
  });
});

describe("W3 virtualization and pointer interaction", () => {
  const viewport = (element: HTMLDivElement | null) => {
    if (!element) return;
    Object.defineProperty(element, "offsetHeight", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(element, "offsetWidth", {
      configurable: true,
      value: 300,
    });
    Object.defineProperty(element, "clientHeight", {
      configurable: true,
      value: 200,
    });
  };
  it("mounts a bounded number of 12,480 rows and retains the active descendant at End", () => {
    const large = Array.from({ length: 12480 }, (_, id) => ({
      id,
      name: `Row ${id}`,
    }));
    render(
      <Listbox
        items={large}
        getKey={(item) => item.id}
        getText={(item) => item.name}
        virtualized
        rowHeight={20}
        ref={viewport}
        aria-label="Large collection"
      />,
    );
    expect(screen.getAllByRole("option").length).toBeLessThan(30);
    const root = screen.getByRole("listbox");
    fireEvent.keyDown(root, { key: "End" });
    const active = document.getElementById(
      root.getAttribute("aria-activedescendant")!,
    );
    expect(active?.textContent).toBe("Row 12479");
    expect(active?.getAttribute("aria-posinset")).toBe("12480");
    expect(active?.getAttribute("aria-setsize")).toBe("12480");
    expect(screen.getAllByRole("option").length).toBeLessThan(30);
  });
  it("virtualizes a 12,480-row tree while retaining complete tree ARIA at End", () => {
    const large = Array.from({ length: 12480 }, (_, id) => ({
      id: String(id),
      name: `Node ${id}`,
    }));
    render(
      <Tree
        items={large}
        getKey={(item) => item.id}
        getText={(item) => item.name}
        getChildren={() => undefined}
        virtualized
        rowHeight={20}
        ref={viewport}
        aria-label="Large tree"
      />,
    );
    const root = screen.getByRole("tree");
    fireEvent.keyDown(root, { key: "End" });
    const active = document.getElementById(
      root.getAttribute("aria-activedescendant")!,
    );
    expect(active?.textContent).toBe("Node 12479");
    expect(active?.getAttribute("aria-level")).toBe("1");
    expect(active?.getAttribute("aria-setsize")).toBe("12480");
    expect(active?.getAttribute("aria-posinset")).toBe("12480");
    expect(screen.getAllByRole("treeitem").length).toBeLessThan(30);
  });
  it("retains labelled groups when virtualizing options", () => {
    render(
      <Listbox
        {...collection}
        getGroup={(item) => item.group}
        virtualized
        rowHeight={20}
        ref={viewport}
        aria-label="Grouped collection"
      />,
    );
    expect(screen.getByRole("group", { name: "First" })).toBeTruthy();
    expect(screen.getByRole("group", { name: "Second" })).toBeTruthy();
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "End" });
    expect(
      screen.getByRole("option", { name: "Echo" }).getAttribute("data-focused"),
    ).toBe("true");
  });
  it("renders measured virtual rows with measurement indices", () => {
    const view = render(
      <VirtualList count={100} measured rowHeight={20} ref={viewport}>
        {(index) => <div>{index}</div>}
      </VirtualList>,
    );
    const row = view.container.querySelector<HTMLElement>(
      "[data-slot=virtual-list-item]",
    );
    expect(Number(row?.getAttribute("data-index"))).toBeGreaterThanOrEqual(0);
    expect(Number(row?.getAttribute("data-index"))).toBeLessThan(100);
    expect(row?.style.height).toBe("");
  });
  it("tracks pointer drag, clamps size and releases dragging state on cancel", () => {
    render(<ResizeHandle defaultValue={200} min={100} max={300} />);
    const handle = screen.getByRole("separator");
    const down = createEvent.pointerDown(handle);
    Object.defineProperties(down, {
      button: { value: 0 },
      pointerId: { value: 1 },
      clientX: { value: 50 },
    });
    fireEvent(handle, down);
    const move = createEvent.pointerMove(handle);
    Object.defineProperties(move, {
      pointerId: { value: 1 },
      clientX: { value: 250 },
    });
    fireEvent(handle, move);
    expect(handle.getAttribute("data-state")).toBe("dragging");
    expect(handle.getAttribute("aria-valuenow")).toBe("300");
    const cancel = createEvent.pointerCancel(handle);
    Object.defineProperty(cancel, "pointerId", { value: 1 });
    fireEvent(handle, cancel);
    expect(handle.getAttribute("data-state")).toBe("idle");
  });
  it("renders a named carousel with slide controls, dots and keyboard navigation", () => {
    render(
      <Carousel aria-label="Projects">
        <CarouselContent>
          {["A", "B", "C"].map((value, i) => (
            <CarouselItem key={value} aria-label={`${i + 1} of 3`}>
              {value}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>,
    );
    expect(
      screen
        .getByRole("region", { name: "Projects" })
        .getAttribute("aria-roledescription"),
    ).toBe("carousel");
    expect(
      (screen.getByLabelText("Previous slide") as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(
      screen.getByLabelText("Show slide 2 of 3").getAttribute("aria-current"),
    ).toBe("true");
    fireEvent.keyDown(screen.getByRole("region"), { key: "End" });
    expect(
      (screen.getByLabelText("Next slide") as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByLabelText("Show slide 1 of 3"));
    expect(
      screen.getByLabelText("Show slide 1 of 3").getAttribute("aria-current"),
    ).toBe("true");
  });
  it("composes custom collection and split roots while keeping refs and behavior", () => {
    const ref = React.createRef<HTMLDivElement>();
    const box = render(
      <Listbox {...collection} asChild ref={ref}>
        <section data-custom="listbox" />
      </Listbox>,
    );
    expect(ref.current?.tagName).toBe("SECTION");
    expect(screen.getAllByRole("option").length).toBe(5);
    box.unmount();
    const split = render(
      <SplitView asChild>
        <section>
          <SplitViewPane>One</SplitViewPane>
          <SplitViewPane>Two</SplitViewPane>
        </section>
      </SplitView>,
    );
    expect(split.container.firstElementChild?.tagName).toBe("SECTION");
    expect(screen.getByRole("separator")).toBeTruthy();
  });
});
