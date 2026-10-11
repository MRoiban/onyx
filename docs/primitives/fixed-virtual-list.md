# useFixedVirtualList

Use a fixed-height render window inside an existing native scrolling viewport, including lists preceded by headers or nested in application-owned scrolling containers. Unlike `VirtualList`, this hook creates no viewport or row elements. It accepts arbitrary row data and does not flatten domain models.

```tsx
const listRef = React.useRef<HTMLDivElement>(null);
const window = useFixedVirtualList({ listRef, rows, getRowKey: row => row.id, rowHeight: 24 });
return <div style={{ height: 240, overflowY: 'auto' }}>
  <header>Items</header>
  <div ref={listRef} style={{ paddingTop: window.paddingTop, paddingBottom: window.paddingBottom }}>
    {window.rows.map(row => <div key={row.id} style={{ height: 24 }}>{row.label}</div>)}
  </div>
</div>;
```

The nearest ancestor with `overflow-y: auto`, `scroll`, or `overlay` supplies scrolling and viewport height. Pass `scrollElementRef` for an explicit viewport. `rowHeight` must match the rendered row's complete height; it defaults to 24 CSS pixels. `overscan` defaults to six rows and `defaultViewportHeight` to 360 pixels before measurement. The returned window includes `startIndex`, exclusive `endIndex`, sliced `rows`, `paddingTop`, `paddingBottom`, and `totalHeight`. The application renders those paddings or equivalent positioned rows to preserve total scroll height.

`anchor: { id, rowKey, block? }` requests one reveal using `start`, `center`, `end`, or default `nearest`. The requested row is temporarily included before the reveal commits; its request ID is then consumed so ordinary scrolling resumes without permanently pinning the row. Missing row keys stay pending until that row appears. Supply a new ID to reveal the same row again. Application code chooses create, rename, focus, and reveal anchors.

The engine subtracts the list's viewport offset from scroll position, preserving content above the list. When `rowHeight` changes, it preserves the first visible row and its fractional position without scaling the preceding header. Native scroll, viewport/list resize, and window resize update measurement; listeners and observers are removed on unmount.

Pure geometry is available through `calculateFixedVirtualListWindow({ rows, scrollTop, viewportHeight, rowHeight?, overscan?, anchorIndex? })`. `findScrollableAncestor`, `getFixedVirtualListOffset`, and `scrollFixedVirtualRowIntoView` expose the headless integration utilities. No theme tokens or CSS are required; the application supplies row geometry and owns its viewport.
