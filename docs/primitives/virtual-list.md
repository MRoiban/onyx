# VirtualList

Use when a scroll viewport should mount only visible rows from a large flat collection. Not for tree expansion or selection logic.

Anatomy: `virtual-list`, `virtual-list-content`, `virtual-list-item`.

`VirtualList` takes `count`, `children(index)`, `getKey(index)`, `rowHeight`, `measured`, `overscan` (default 4), `activeIndex`, and `enabled`. Supply a constrained CSS height to create a viewport. Fixed rows use `rowHeight` (defaults to the computed density row token). For variable content, `measured` attaches TanStack's `measureElement` to wrappers carrying `data-index`; `rowHeight` is then an estimate. With `asChild`, pass the custom root through `viewport` because `children` is the row render function. Keep row keys stable when collections reorder.

`activeIndex` scrolls into view and is included in the mounted range, suitable for aria-activedescendant keyboard models. VirtualList is semantically neutral; the caller supplies list/grid/tree ARIA.

Tokens: `--onyx-row-height` for the density-aware height estimate. Position/height styles represent measured runtime geometry rather than design constants.

Headless: `useVirtualList(options)` returns `ref` (attach to the scroll element), `virtualizer`, `virtualItems`, `totalSize`, `measureElement` and `scrollIntoView(index)`. Render an absolute-positioned content spacer of `totalSize` using the provided item starts. `virtualListVariants` is exported.

[TanStack Virtualizer API](https://tanstack.com/virtual/latest/docs/api/virtualizer).

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

`calculateMeasuredVirtualWindow(heights, scrollTop, viewportHeight, overscan = 12)` returns contiguous `start` / `end` indices and `before` / `after` spacer sizes when a host already tracks variable row heights. Empty and out-of-range viewports remain bounded.
