# SplitView

Use when adjacent panes share a constrained resizable area, including nested horizontal/vertical editor layouts. Not for moving/resizing unrelated windows.

Anatomy: `split-view`, `split-view-pane`, `split-view-handle`. Handles reuse ResizeHandle internals and state attributes.

`SplitView` accepts direct `SplitViewPane` children, `orientation="horizontal|vertical"` (layout direction), controlled `sizes` / `onSizesChange`, `defaultSizes`, and `autoSaveId`. It inserts handles between panes; `handleProps` supplies shared handle options such as `showSize` and `formatValue`. **Sizes/minSize/maxSize/defaultSize/collapsedSize/snap are percentages of the group.** `minPixels` / `maxPixels` add measured physical constraints, intersected with percentages. Supply feasible constraints (expanded minimum sum <= 100 and maximum sum >= 100); a collapsed pane's reserved size is included in that sum. Pane defaults are equal weights unless `defaultSizes` or `defaultSize` is supplied. A root must have a definite extent in its resize direction.

Pane props: `minSize`, `maxSize`, `minPixels`, `maxPixels`, `collapsible`, `collapsedSize`, `snap`, `defaultSize`, plus ordinary HTML props and `asChild`. Collapsed panes are inert and clip content. `SplitViewHandle` is exported for custom composition with the sizing context and an `index`; the standard root inserts it automatically. It publishes `aria-controls` and percent value text. Keyboard movement converts 10/50 CSS pixels into percent changes. Adjacent-pair resizing preserves other panes and the pair total, respects both neighbors' bounds, snaps and collapses. Double-click restores the preceding pane's default within adjacent constraints.

`autoSaveId` stores JSON sizes at `onyx:split:<id>` in localStorage, reads once on mount, validates the saved array, and tolerates unavailable storage. Controlled sizes take precedence. Changing storage identity requires remounting if a different saved layout should be loaded. For `asChild` root composition, wrap the pane children in one custom root element.

State: root/pane `data-orientation`; pane `data-state="collapsed|expanded"`; handle `data-state="idle|hover|dragging"`, `data-orientation` (perpendicular to the layout).

Tokens: ResizeHandle tokens plus `--onyx-surface-panel`, `--onyx-radius-md`, `--onyx-text-{description,sm}`. Pane spacing is consumer supplied to allow editor canvases with no padding.

Headless: `useSplitView({sizes,defaultSizes,onSizesChange,autoSaveId,constraints,orientation})` returns `ref`, extent, normalized sizes/defaults, effective percentage constraints, setters, `resize(index,nextSize)` and `reset()`. Attach its ref for pixel conversion/constraints. Pure math exports: `normalizeSplitSizes(sizes,constraints)` and `resizeSplitSizes(sizes,index,nextSize,constraints,snapThreshold)`. Exported cva functions: `splitViewVariants`, `splitViewPaneVariants`.

The model follows [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)' adjacent-pane constraint behavior while keeping Onyx's own generic primitive API.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

Storage availability checks, reads, and writes are guarded; unavailable/throwing localStorage and server rendering fall back to default sizes.
