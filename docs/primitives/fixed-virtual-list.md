# useFixedVirtualList

A hook that virtualizes fixed-height rows inside a scroll container **you already have**. It works even when other content, such as a header, sits above the list in the same scroller. It renders nothing itself: it tells you which rows to render and how much padding to add.

**Use when:** a long list lives inside an existing scrolling panel, below headers, or within app-owned layout that can't be replaced with a new viewport.
**Not for:** a list with its own viewport (use [VirtualList](virtual-list.md), which is simpler), or rows of varying height (use VirtualList with `measured`).

## Import

```tsx
import { useFixedVirtualList, calculateFixedVirtualListWindow } from '@mroiban/onyx/fixed-virtual-list';
```

## Example

```tsx
const listRef = React.useRef<HTMLDivElement>(null);
const view = useFixedVirtualList({
  listRef,
  rows,
  getRowKey: (row) => row.id,
  rowHeight: 24,
  anchor: reveal ? { id: reveal.requestId, rowKey: reveal.rowId, block: 'center' } : null
});

<div style={{ height: 240, overflowY: 'auto' }}>        {/* existing scroller */}
  <header>Items</header>
  <div ref={listRef} style={{ paddingTop: view.paddingTop, paddingBottom: view.paddingBottom }}>
    {view.rows.map((row) => <div key={row.id} style={{ height: 24 }}>{row.label}</div>)}
  </div>
</div>
```

## API

**Options**

| Option | Type | Default | Notes |
|---|---|---|---|
| `listRef` | `RefObject<HTMLElement>` | — | **Required.** The element that holds the rows. |
| `rows` | `readonly T[]` | — | **Required.** Any data. Nothing is flattened for you. |
| `getRowKey` | `(row) => Key` | — | **Required.** |
| `rowHeight` | `number` (px) | `24` | **Must equal** each rendered row's full height. |
| `overscan` | `number` | `6` | |
| `defaultViewportHeight` | `number` | `360` | Used before the first measurement. |
| `scrollElementRef` | `RefObject<HTMLElement>` | the nearest ancestor with `overflow-y: auto`, `scroll` or `overlay` | |
| `anchor` | `{ id; rowKey; block? }` | — | Scrolls one row into view, once per `id`. `block` is `'start'`, `'center'`, `'end'` or `'nearest'` (default). |

**Returns** `{ startIndex, endIndex (exclusive), rows, paddingTop, paddingBottom, totalHeight }`.

**Pure helpers:** `calculateFixedVirtualListWindow({ rows, scrollTop, viewportHeight, rowHeight?, overscan?, anchorIndex? })`, `findScrollableAncestor`, `getFixedVirtualListOffset` and `scrollFixedVirtualRowIntoView`.

## Behavior contract

**Onyx owns:** finding the scroller, allowing for content above the list, listening to scroll and resize (cleaned up on unmount), keeping the first visible row in place when `rowHeight` changes, and handling one-off reveal requests.

**You supply:** the scroller, the row markup at exactly `rowHeight`, the padding, all ARIA semantics, and deciding when to reveal a row (after create, rename, focus, …).

## Anatomy

None. The hook renders nothing.

## Tokens read

None.

## Gotchas

- **Reveal requests are consumed once.** To reveal the same row again, pass a new `anchor.id`. A row key that doesn't exist yet stays pending until that row appears.
- **The padding is required.** Without `paddingTop` and `paddingBottom` the scroll height collapses and the scrollbar jumps.
