# W3 · Collections & structure implementation report

Work is uncommitted on `feat/primitives-expansion`. W3 source changes stayed within the ownership row. No package, registry, index, global stylesheet, Tailwind config, or consumer repository was manually edited. The existing gallery server on port 4816 was reused; its generated CSS was rebuilt.

## Result and public API

- **Listbox:** `Listbox<T>`, `ListboxGroup`, `useListbox<T>`, `listboxVariants`; generic keys/text/disabled predicates, single/multiple/none selection, controlled/uncontrolled selection and focus, Shift range, Cmd/Ctrl toggle/select-all, Space, Home/End, buffered typeahead, labelled groups including virtual groups, and optional virtualization. Grouped keyboard order matches displayed group order. Focus uses `aria-activedescendant`; focus does not automatically select.
- **Tree:** `Tree<T>`, `useTree<T>`, `flattenTree`, `treeVariants`; generic items/getKey/getChildren/isExpandable, flattened visible rows, expansion, multi-selection, typeahead, complete virtual-row ARIA positions, async loading/error/retry state, rename render prop, F2/commit/cancel, consumer drag/drop callbacks, controlled drop indicators and before/inside/after positions. Right/Left/*/Enter implement tree navigation. The file model remains outside Onyx.
- **VirtualList:** `VirtualList`, `useVirtualList`, `virtualListVariants`; TanStack Virtual fixed/measured heights, overscan, stable keys, active-row retention and keyboard scrollIntoView. Default estimates resolve CSS lengths from the row token, including rem/calc. `asChild` uses the `viewport` element prop because children is a row render function.
- **ScrollArea:** `ScrollArea`, `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollAreaScrollbar`, `ScrollAreaThumb`, `ScrollAreaCorner`, `scrollAreaVariants`; Radix overlay scrollbars, hover widening, semantic scrollbar colors, horizontal option, viewport ref/props and optional real top/bottom edge shadows.
- **ResizeHandle:** `ResizeHandle`, `useResizable`, `resizeHandleVariants`; pointer capture/cancel/lost-capture cleanup, separator ARIA, controlled/uncontrolled size, Arrow 10px / Shift 50px, Home/End, Enter collapse/restore, double-click reset, direction/unit conversion, snap points, optional grip and size tooltip.
- **SplitView:** `SplitView`, `SplitViewPane`, `SplitViewHandle`, `useSplitView`, `normalizeSplitSizes`, `resizeSplitSizes`, `splitViewVariants`, `splitViewPaneVariants`; horizontal/vertical nesting, adjacent pair constraints, percentage sizes, optional pixel limits, collapse/inert panes, snap, controlled sizes, default sizes and localStorage persistence. `handleProps` allows shared handle customization. Definite container extent and feasible constraints are documented prerequisites.
- **Collapsible:** `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`, `useCollapsible`, `collapsibleVariants`; Radix behavior, default chevron, controlled/uncontrolled expansion, W0 animation classes and reduced motion.
- **Accordion:** `Accordion`, `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, `AccordionContent`, `useAccordion`, `accordionVariants`; Radix single/multiple behavior, chevron/meta slot, ARIA/keyboard wiring and W0 animations. The headless hook consistently uses arrays; component props retain Radix's string/array discriminated API.
- **Pagination:** `Pagination`, `PaginationButton`, `usePagination`, `getPaginationRange`, `paginationVariants`; labelled nav, bounded previous/next, stable ellipsis algorithm, aria-current and controlled/uncontrolled page. Non-finite total-page input produces an empty range.
- **Carousel:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselDots`, `useCarousel`, `carouselVariants`; scroll snap, 70% default slide width, region/slide roledescriptions, controls/dots, keyboard, controlled/uncontrolled index, settled-scroll reconciliation and reduced-motion instant scrolling. No autoplay.
- **Tabs:** existing exports remain; `variant="line"` supplements the default editor style, `tabsVariants` is exported, tab/panel IDs are connected, and the list uses roving focus with disabled skipping and manual activation. Root/list/trigger/content support asChild.
- **Table:** existing exports remain; `TableHead` adds `sort`, `onSort`, `sortButtonProps`, aria-sort, button and icon. `TableRow` adds selected state. `tableVariants` and asChild composition are available. Data sorting remains in the consumer.
- **Panel:** existing exports remain; `ListRow`/`TreeRow` are the token-based visual layer, with selected/focused/disabled props and asChild. `listRowVariants`/`treeRowVariants` are exported. Legacy data-state=active styling remains. Panel parts also accept asChild.
- **Sidebar:** existing API remains. SidebarRail now uses ResizeHandle and accepts optional width/defaultWidth/minWidth/maxWidth/onWidthChange/disabled/asChild props. WorkbenchSidebar routes its existing width callback and limits through the same keyboard/pointer model. Collapse retains the last expanded width so the existing context toggle restores it, and icon mode retains its collapsed width. The existing environment resize helper remains exported; the component no longer uses its global pointer listeners.

Parts forward refs, merge classes and expose slots/state attributes. Component styles live in `@layer onyx.components` and read semantic/component tokens. New disclosures and motion respect reduced motion.

## Files changed

Components:

- `src/components/{listbox,tree,virtual-list,scroll-area,resize-handle,split-view,collapsible,accordion,pagination,carousel}.tsx`
- `src/components/{panel,sidebar,tabs,table}.tsx`

Other source:

- `src/styles/collections.css`
- `gallery/sections/collections.tsx`
- `test/collections.test.tsx`

Documentation:

- `docs/primitives/{listbox,tree,virtual-list,scroll-area,resize-handle,split-view,collapsible,accordion,pagination,carousel,tabs,table,panel,sidebar}.md`
- `docs/primitives/w3-report.md`

Screenshots: eight implementation PNGs and two reference PNGs listed below. `gallery/onyx.css` is a generated build output, not a manual shared-file source change.

## Validation

Latest validation after the final behavior changes:

```text
bun run typecheck: PASS
bun test: 119 pass, 0 fail, 2609 expect() calls, 20 files
W3-specific tests: 28 pass
bun run build:css: PASS
git diff --check: PASS
```

Coverage includes single/multi selection, grouped navigation, buffered typeahead, consecutive headless state updates, controlled values, tree flattening/navigation/selection, async loading and duplicate-request prevention, rename key isolation, drag/drop indicators, resize keyboard/pointer cancellation and ARIA, sidebar toggle restoration, adjacent-pane min/max/collapse/snap invariants, persistence, pagination, single/multiple accordion, line tabs, sortable table wiring, carousel controls and asChild roots. Separate 12,480-row listbox and tree tests verify bounded mount counts and active-descendant retention at End. Measured virtual rows carry measurement indices and are not forced to an estimate height.

In the live browser, overriding the tree row token to `3rem` produced 48px rows and a 599,040px spacer (12,480 × 48) while retaining eight mounted rows; the override was removed afterwards.

Early validation encountered W1/W2/W4 in-progress errors. They resolved in their own workstreams; no other workstream's source was fixed by W3. The final repository-wide run is green.

## Gallery and visual verification

The collection section contains the mockup's workspace names, files, selected/focused/drop/rename states, dialogue, split panes, Editor/Sync/Keyboard accordion and Overview/Logs/Settings tabs. The tree contains **12,480 flattened visible rows**, with eight mounted at rest. Dragging a file into a folder invokes real application model mutation in the demo. Inline rename edits the demo data.

`PaginationCarousel` is also exported from the owned gallery module. Until the orchestrator integrates its Feedback slot, it renders in a separate block immediately before Collections. The isolated comparison route is:

```text
http://localhost:4816/?section=collections&theme=dark&density=compact
```

This optional route hides sibling gallery sections and their body portals for stable W3 screenshot review. The default gallery continues to show every workstream.

Captured with the requested installed Chromium headless shell at 1280×5000 and 390×5000. Inspected desktop and narrow dark/compact and light/comfortable against a temporary extraction of the original mockup's CSS/header/W3 cells; the design source was not edited. Also captured dark/comfortable and light/compact at both widths.

Implementation screenshots:

- [w3-1280-dark-compact.png](../../gallery/screenshots/w3-1280-dark-compact.png)
- [w3-1280-light-comfortable.png](../../gallery/screenshots/w3-1280-light-comfortable.png)
- [w3-390-dark-compact.png](../../gallery/screenshots/w3-390-dark-compact.png)
- [w3-390-light-comfortable.png](../../gallery/screenshots/w3-390-light-comfortable.png)
- [w3-1280-dark-comfortable.png](../../gallery/screenshots/w3-1280-dark-comfortable.png)
- [w3-1280-light-compact.png](../../gallery/screenshots/w3-1280-light-compact.png)
- [w3-390-dark-comfortable.png](../../gallery/screenshots/w3-390-dark-comfortable.png)
- [w3-390-light-compact.png](../../gallery/screenshots/w3-390-light-compact.png)

Reference extractions:

- [w3-reference-1280-dark-compact.png](../../gallery/screenshots/w3-reference-1280-dark-compact.png)
- [w3-reference-390-light-comfortable.png](../../gallery/screenshots/w3-reference-390-light-comfortable.png)

Visual deviations and reasons:

- Resize handles are idle at rest; blue hover/drag highlights and size tips appear during real interaction. The mockup forces these transient states statically. No fake dragging state was introduced.
- The Explorer enforces its stated 160px minimum at 390px, so narrow pane proportions differ from the mockup's unconstrained 26% layout. Desktop proportions match.
- Scrollbar length/position and both edge shadows reflect real overflowing dialogue, rather than the mockup's fixed 34% thumb/top shadow. The demo aligns its initial view to Line 41 in both densities.
- Pagination/Carousel cell placement is temporarily separate from Feedback because W3 cannot edit the shared scaffold or W4 gallery file. A shared integration request follows.
- Small icon/control differences come from composing actual Onyx controls and semantic focus geometry. The corrected carousel uses the reference's 70% width, 110px height and bottom labels. No theme colors or spacing palette were invented.

## Shared-file requests

No new package dependency, export, global CSS import, or keyframe is needed. All requested subpaths and exports were prewired by W0.

**Gallery integration:** import the named `PaginationCarousel` export into the Feedback grid (mockup section 5), and remove its temporary standalone rendering at the top of Collections during integration. W3 did not edit the shared app/scaffold or W4's gallery section.

**Registry metadata:** correct the following `registryDependencies`. The key change is removing virtual-list → listbox, which would become a cycle now that listbox uses virtual-list.

```json
{
  "listbox": ["theme", "hooks", "panel", "virtual-list"],
  "tree": ["theme", "hooks", "listbox", "panel", "virtual-list", "icon"],
  "virtual-list": ["theme", "hooks"],
  "scroll-area": ["theme", "hooks"],
  "resize-handle": ["theme", "hooks"],
  "split-view": ["theme", "hooks", "resize-handle"],
  "collapsible": ["theme", "hooks", "icon"],
  "accordion": ["theme", "hooks", "icon"],
  "pagination": ["theme", "hooks", "icon"],
  "carousel": ["theme", "hooks", "icon"],
  "tabs": ["theme", "button", "hooks"],
  "sidebar": ["theme", "button", "icon", "resize-handle"],
  "panel": ["theme"],
  "table": ["theme", "icon"]
}
```

Runtime metadata:

- Manual new modules (`listbox`, `tree`, `resize-handle`, `split-view`, `pagination`, `carousel`): `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`.
- `virtual-list`: those four plus `@tanstack/react-virtual`.
- `scroll-area`: `@radix-ui/react-scroll-area`, `class-variance-authority`, `clsx`, `tailwind-merge` (the prefilled Slot entry may remain harmlessly).
- `collapsible`: `@radix-ui/react-collapsible`, `class-variance-authority`, `clsx`, `tailwind-merge` (the prefilled Slot entry may remain).
- `accordion`: `@radix-ui/react-accordion`, `class-variance-authority`, `clsx`, `tailwind-merge` (the prefilled Slot entry may remain).
- **Add** `class-variance-authority` and `@radix-ui/react-slot` to existing `panel` and `table` runtime dependency lists; keep `clsx`/`tailwind-merge`.
- **Add** `@radix-ui/react-slot` to existing `tabs` runtime dependencies; keep cva/clsx/tailwind-merge.
- `sidebar` direct runtime dependencies remain `clsx`, `tailwind-merge`; ResizeHandle's dependencies arrive through its registry dependency.

## Open issues / limits

No W3 test/typecheck blocker remains. Shared registry and Feedback placement changes are pending orchestration. Pane constraints must be feasible for the available extent; an application must choose its responsive/collapse policy if all physical minimums exceed the container. Keys must be stable and globally unique in a tree. Async loader cancellation, rename validation and permitted file moves remain caller-owned. Storage identity is read once on mount; remount to load a different autoSaveId. Carousel is intentionally non-autoplay.
