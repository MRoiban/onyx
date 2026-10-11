# ResizeHandle

Use when a separator changes the size of an adjacent region. Not for arbitrary drag/drop.

Anatomy: `resize-handle`, `resize-handle-grip`, `resize-handle-tooltip`.

`ResizeHandle` takes `value` / `defaultValue` (default 240), `onValueChange`, `min` (0), `max` (1000), `orientation="vertical|horizontal"` (separator orientation), `disabled`, `collapsible`, `collapsedSize` (0), `unitsPerPixel` (1), `direction` (1 or -1), `snap`, `snapThreshold` (4 value units), `onResizeStart`, `onResizeEnd`, `showSize`, `formatValue`, and `grip`. Supply `aria-label` and optional `aria-controls`. Pointer capture handles drag/up/cancel/lost capture. Pointer deltas use `unitsPerPixel` and `direction` so percent-based or right-edge layouts can reuse the model.

Vertical separators use Left/Right, horizontal separators Up/Down. Arrows change 10px, Shift+arrows 50px. Home goes to minimum (or collapsed size), End to maximum, Enter toggles collapse/restores the last expanded size, and double-click resets to `defaultValue`. Snapping is applied within bounds. Values between collapsed and minimum use a midpoint collapse threshold.

State: `data-state="idle|hover|dragging"`, `data-orientation`, `data-disabled`; role separator with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-orientation`, `aria-disabled`. The optional size tooltip appears on hover/drag and is rendered without a portal.

Tokens: `--onyx-resize-handle-size` (hit area), `--onyx-border-{default,strong}`, `--onyx-control-focus-ring`, `--onyx-space-{0-5,1,2,6}`, `--onyx-radius-{xs,sm}`, `--onyx-text-xs`, `--onyx-text-foreground`, `--onyx-surface-tooltip`, `--onyx-shadow-md`, `--onyx-z-tooltip`.

Headless: `useResizable(options)` returns `value`, `setValue`, `dragging`, `hovered`, `collapsed` and `handleProps`. Attach all handle props to a focusable separator. `resizeHandleVariants({orientation})` is exported.

[APG window splitter pattern](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/).

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

`onResizeStart` and `onResizeEnd` also surround keyboard and double-click changes. `onValueChange` runs before completion so persistence adapters can commit the latest value consistently for pointer and discrete interactions.
