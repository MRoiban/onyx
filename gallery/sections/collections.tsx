import * as React from "react";
import { Listbox } from "../../src/components/listbox";
import { Tree } from "../../src/components/tree";
import { ScrollArea } from "../../src/components/scroll-area";
import { SplitView, SplitViewPane } from "../../src/components/split-view";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "../../src/components/accordion";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../src/components/collapsible";
import { Pagination } from "../../src/components/pagination";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselDots,
} from "../../src/components/carousel";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../src/components/tabs";
import { Icon } from "../../src/components/icon";
import { Input } from "../../src/components/input";

const metaStyle: React.CSSProperties = {
  marginLeft: "auto",
  fontSize: "var(--onyx-text-xs)",
  color: "var(--onyx-text-description)",
  paddingLeft: "var(--onyx-space-2)",
};
const paneStyle: React.CSSProperties = {
  padding:
    "var(--onyx-space-2) calc(var(--onyx-space-2) + var(--onyx-space-0-5))",
};
const projects = [
  { key: "babel", name: "babel-translations", group: "Recent", meta: "2m ago" },
  {
    key: "expanded",
    name: "stardew-expanded",
    group: "Recent",
    meta: "3d ago",
  },
  {
    key: "sunberry",
    name: "sunberry-village",
    group: "Recent",
    meta: "1w ago",
  },
  {
    key: "legacy",
    name: "legacy-mod",
    group: "Archived",
    meta: "read-only",
    disabled: true,
  },
];
interface File {
  key: string;
  name: string;
  children?: File[];
  folder?: boolean;
}
const i18n: File = {
  key: "i18n",
  name: "i18n",
  folder: true,
  children: [
    { key: "fr", name: "fr.json" },
    { key: "default", name: "default.json" },
    { key: "de", name: "de.json" },
  ],
};
const files: File[] = [
  {
    key: "mods",
    name: "mods",
    folder: true,
    children: [
      {
        key: "sunberry",
        name: "[CP] Sunberry Village",
        folder: true,
        children: [{ key: "assets", name: "assets", folder: true }, i18n],
      },
      { key: "lurking", name: "Lurking in the Dark", folder: true },
    ],
  },
  ...Array.from({ length: 12472 }, (_, index) => ({
    key: `virtual-${index}`,
    name: `Translation ${String(index + 1).padStart(5, "0")}.json`,
  })),
];
function Cell({
  title,
  detail,
  wide,
  children,
}: {
  title: string;
  detail?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`g-cell${wide ? " wide" : ""}`}>
      <h3>
        {title}
        {detail && <code>{detail}</code>}
      </h3>
      {children}
    </div>
  );
}
export function PaginationCarousel() {
  return (
    <Cell title="Pagination · Carousel">
      <div className="col" style={{ gap: 14 }}>
        <Pagination defaultPage={5} totalPages={20} />
        <Carousel aria-label="Projects">
          <CarouselContent>
            <CarouselItem
              aria-label="Bedrock, slide 1 of 3"
              style={{
                height: 110,
                display: "flex",
                alignItems: "flex-end",
                padding: "calc(var(--onyx-space-2) + var(--onyx-space-0-5))",
                color: "var(--onyx-tone-info-solid-fg)",
                background: "var(--onyx-tone-info-solid)",
                fontWeight: 600,
                borderRadius: "var(--onyx-radius-md)",
              }}
            >
              Bedrock
            </CarouselItem>
            <CarouselItem
              aria-label="Babel, slide 2 of 3"
              style={{
                height: 110,
                display: "flex",
                alignItems: "flex-end",
                padding: "calc(var(--onyx-space-2) + var(--onyx-space-0-5))",
                color: "var(--onyx-tone-success-solid-fg)",
                background: "var(--onyx-tone-success-solid)",
                fontWeight: 600,
                borderRadius: "var(--onyx-radius-md)",
              }}
            >
              Babel
            </CarouselItem>
            <CarouselItem
              aria-label="Onyx, slide 3 of 3"
              style={{
                height: 110,
                display: "flex",
                alignItems: "flex-end",
                padding: "calc(var(--onyx-space-2) + var(--onyx-space-0-5))",
                color: "var(--onyx-tone-neutral-solid-fg)",
                background: "var(--onyx-tone-neutral-solid)",
                fontWeight: 600,
                borderRadius: "var(--onyx-radius-md)",
              }}
            >
              Onyx
            </CarouselItem>
          </CarouselContent>
          <CarouselNext />
          <CarouselDots />
        </Carousel>
      </div>
    </Cell>
  );
}
function Rename({
  item,
  commit,
  cancel,
}: {
  item: File;
  commit: (name: string) => void;
  cancel: () => void;
}) {
  const [name, setName] = React.useState(item.name);
  const input = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    input.current?.focus({ preventScroll: true });
  }, []);
  return (
    <>
      <Icon name="json" />
      <Input
        ref={input}
        className="h-[calc(var(--onyx-row-height)-var(--onyx-space-0-5))] px-[var(--onyx-space-1)]"
        aria-label="Rename file"
        value={name}
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(name);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancel();
          }
        }}
      />
    </>
  );
}
function FileTree() {
  const [items, setItems] = React.useState(files);
  const [rendered, setRendered] = React.useState(8);
  const onRange = React.useCallback((count: number) => setRendered(count), []);
  const rename = (item: File, name: string) => {
    const update = (nodes: File[]): File[] =>
      nodes.map((node) => ({
        ...node,
        name: node.key === item.key ? name : node.name,
        children: node.children ? update(node.children) : undefined,
      }));
    setItems(update);
  };
  const move = (keys: (string | number)[], target: string | number, position: "before" | "inside" | "after") => {
    setItems((current) => {
      const moving: File[] = [];
      const remove = (nodes: File[]): File[] => nodes.flatMap((node) => {
        if (keys.includes(node.key)) { moving.push(node); return []; }
        return [{ ...node, children: node.children ? remove(node.children) : undefined }];
      });
      const rest = remove(current);
      const insert = (nodes: File[]): File[] => nodes.flatMap((node) => {
        if (node.key === target) {
          if (position === "before") return [...moving, node];
          if (position === "after") return [node, ...moving];
          return [{ ...node, children: [...(node.children ?? []), ...moving] }];
        }
        return [{ ...node, children: node.children ? insert(node.children) : undefined }];
      });
      return insert(rest);
    });
  };
  return (
    <>
      <div
        style={{
          border: "1px solid var(--onyx-border-default)",
          borderRadius: "var(--onyx-radius-md)",
          padding: "calc(var(--onyx-space-1-5) / 2)",
          background: "var(--onyx-surface-panel)",
        }}
      >
        <Tree
          aria-label="Translation files"
          items={items}
          getKey={(item) => item.key}
          getText={(item) => item.name}
          getChildren={(item) => item.children}
          isExpandable={(item) => !!item.folder}
          selectionMode="multiple"
          defaultExpandedKeys={["mods", "sunberry", "i18n"]}
          defaultSelectedKeys={["fr", "default"]}
          defaultFocusedKey="fr"
          defaultRenamingKey="de"
          onRename={rename}
          renderRename={(item, actions) => <Rename item={item} {...actions} />}
          virtualized
          overscan={0}
          onRenderedRangeChange={onRange}
          draggable={(item) => !item.folder}
          defaultDropTarget={{ item: i18n, key: "i18n", position: "inside" }}
          canMove={(_, target) => target.position !== "inside" || !!target.item.folder}
          onMoveItem={move}
          style={{
            height: "calc(var(--onyx-row-height) * 8)",
            border: 0,
            borderRadius: 0,
            padding: 0,
          }}
          renderItem={(item, state) => (
            <>
              <Icon
                name={
                  item.folder
                    ? state.expanded
                      ? "folder-opened"
                      : "folder"
                    : "json"
                }
              />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.name}
              </span>
              {item.key === "fr" && (
                <span style={metaStyle}>
                  <span
                    className="badge"
                    data-tone="warning"
                    style={{ height: 16 }}
                  >
                    M
                  </span>
                </span>
              )}
            </>
          )}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "var(--onyx-text-xs)",
            color: "var(--onyx-text-description)",
            padding: "var(--onyx-space-1) var(--onyx-space-1-5) 0",
          }}
        >
          <span>Rendering {rendered} of 12,480 rows</span>
          <span>useVirtualList</span>
        </div>
      </div>
      <p className="g-note">
        Onyx owns keyboard, selection, expansion, type-ahead, inline-rename slot
        and drop indicators; the file model stays in Gemstone's explorer.
      </p>
    </>
  );
}
export default function Collections() {
  // Isolated comparison mode keeps this workstream reviewable during concurrent work.
  const isolated =
    new URLSearchParams(location.search).get("section") === "collections";
  return (
    <>
      {isolated && (
        <style>{`.onyx > .g-sec:not(#collections):not([data-w3-feedback]) { display: none; } body > :not(#app):not(script):not(style):not(link) { display: none; }`}</style>
      )}
      <section className="g-sec" id="collections">
        <h2>6 · Collections &amp; structure</h2>
        <div className="g-grid">
          <Cell title="Listbox" detail="single · multi · groups · typeahead">
            <Listbox
              aria-label="Workspaces"
              items={projects}
              getKey={(item) => item.key}
              getText={(item) => item.name}
              getGroup={(item) => item.group}
              isDisabled={(item) => !!item.disabled}
              selectionMode="multiple"
              defaultSelectedKeys={["babel", "expanded"]}
              defaultFocusedKey="expanded"
              renderItem={(item) => (
                <>
                  <Icon name={item.disabled ? "archive" : "folder"} />
                  {item.name}
                  <span style={metaStyle}>{item.meta}</span>
                </>
              )}
            />
          </Cell>
          <Cell title="Tree" detail="keyboard · pointer moves · virtual · DnD">
            <FileTree />
            <p className="g-note">Pointer: click a file, Cut, click a target, then Paste before / inside / after. Cancel move clears the cut. Keyboard: Ctrl/⌘+X, then Ctrl/⌘+V (inside), Shift+V (before), Alt+Shift+V (after). Escape cancels.</p>
          </Cell>
          <Cell title="ScrollArea" detail="overlay thumb · edge shadow">
            <ScrollArea
              edgeShadows
              type="always"
              style={{ height: 140 }}
              viewportProps={{
                ref: (node) => {
                  if (node) {
                    const first = node.querySelector<HTMLElement>(
                      "[data-w3-scroll-first]",
                    );
                    if (first)
                      node.scrollTop =
                        first.getBoundingClientRect().height +
                        parseFloat(
                          getComputedStyle(first.parentElement!).rowGap,
                        );
                  }
                },
              }}
            >
              <div
                style={{
                  padding:
                    "var(--onyx-space-2) calc(var(--onyx-space-4) + var(--onyx-space-0-5)) var(--onyx-space-2) calc(var(--onyx-space-2) + var(--onyx-space-0-5))",
                  fontSize: "var(--onyx-text-sm)",
                  color: "var(--onyx-text-muted)",
                  display: "grid",
                  gap: "var(--onyx-space-1-5)",
                }}
              >
                {[
                  'Line 40 — "Abigail.Dance": "On danse ?"',
                  'Line 41 — "Abigail.Hello": "Salut !"',
                  'Line 42 — "Abigail.Rain": "Il pleut encore…"',
                  'Line 43 — "Alex.Gridball": "Tu joues ?"',
                  'Line 44 — "Caroline.Tea": "Un thé ?"',
                  'Line 45 — "Clint.Ore": "Du minerai ?"',
                  'Line 46 — "Demetrius.Lab": "Je travaille."',
                  ...Array.from(
                    { length: 10 },
                    (_, i) => `Line ${47 + i} — More dialogue`,
                  ),
                ].map((line) => (
                  <div
                    key={line}
                    data-w3-scroll-first={
                      line.startsWith("Line 40") ? "" : undefined
                    }
                  >
                    {line}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Cell>
          <Cell
            title="SplitView · ResizeHandle"
            detail="role=separator · keyboard · snap · persist"
            wide
          >
            <SplitView
              defaultSizes={[26, 52, 22]}
              autoSaveId="gallery-w3-main"
              handleProps={{
                showSize: true,
                formatValue: (value) => `${Math.round(value)}%`,
              }}
              style={{ height: 180 }}
            >
              <SplitViewPane
                minSize={12}
                minPixels={160}
                maxSize={60}
                collapsible
                snap={[26]}
                style={paneStyle}
              >
                Explorer
                <br />
                <span style={{ fontSize: "var(--onyx-text-xs)" }}>
                  min 160 · collapsible
                </span>
              </SplitViewPane>
              <SplitViewPane minSize={20}>
                <SplitView
                  orientation="vertical"
                  defaultSizes={[66, 34]}
                  style={{ height: "100%", border: 0, borderRadius: 0 }}
                >
                  <SplitViewPane
                    minSize={20}
                    style={{
                      ...paneStyle,
                      background: "var(--onyx-surface-app)",
                    }}
                  >
                    Editor
                  </SplitViewPane>
                  <SplitViewPane minSize={20} collapsible style={paneStyle}>
                    Panel
                  </SplitViewPane>
                </SplitView>
              </SplitViewPane>
              <SplitViewPane minSize={10} maxSize={40} style={paneStyle}>
                Outline
              </SplitViewPane>
            </SplitView>
            <p className="g-note">
              Arrow keys resize by 10px (Shift = 50px), Home/End snap to
              min/max, Enter toggles collapse, double-click resets. The Sidebar
              rail reuses ResizeHandle.
            </p>
          </Cell>
          <Cell title="Accordion · Collapsible">
            <div className="col">
              <Accordion type="single" collapsible defaultValue="editor">
                {[
                  ["editor", "Editor", "Font, tab size, word wrap, minimap."],
                  ["sync", "Sync", "Sync translation changes across servers."],
                  ["keyboard", "Keyboard", "Configure keyboard shortcuts."],
                ].map(([value, label, text]) => (
                  <AccordionItem key={value} value={value}>
                    <AccordionHeader>
                      <AccordionTrigger
                        meta={
                          value === "editor" ? (
                            <span className="badge">4</span>
                          ) : undefined
                        }
                      >
                        {label}
                      </AccordionTrigger>
                    </AccordionHeader>
                    <AccordionContent>{text}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <Collapsible>
                <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="g-note">
                    Experimental settings for this workspace.
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </Cell>
          <Cell title="Tabs" detail="existing · new line variant">
            <Tabs variant="line" defaultValue="overview">
              <TabsList aria-label="Workspace views">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" />
              <TabsContent value="logs">
                <p className="g-note">Workspace logs appear here.</p>
              </TabsContent>
              <TabsContent value="settings">
                <p className="g-note">Workspace preferences appear here.</p>
              </TabsContent>
            </Tabs>
            <p className="g-note">
              Adds a <code>variant="line"</code> for web pages next to the
              existing editor-tab style.
            </p>
          </Cell>
        </div>
      </section>
    </>
  );
}
