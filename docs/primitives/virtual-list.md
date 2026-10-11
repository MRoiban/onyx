# VirtualList

A scrolling viewport that renders only the rows currently visible, so lists of thousands of items stay fast. Rows can have a fixed or measured height. Built on TanStack Virtual.

**Use when:** you render a long flat list in its own scroll area: logs, search results, a large file list.
**Not for:** a list inside a scroll container you already have, or one that sits below a header in the same scroller (use [`useFixedVirtualList`](fixed-virtual-list.md)), or for selection and keyboard behavior (VirtualList has none; use [Listbox](listbox.md) or [Tree](tree.md), which can virtualize themselves).

## Import

```tsx
import { VirtualList, useVirtualList, calculateMeasuredVirtualWindow } from '@mroiban/onyx/virtual-list';
```

## Example

```tsx
<VirtualList
  style={{ height: 400 }}
  count={lines.length}
  getKey={(i) => lines[i].id}
  rowHeight={22}
  role="log"
  aria-label="Build output"
>
  {(i) => <div className="log-line">{lines[i].text}</div>}
</VirtualList>

{/* variable heights */}
<VirtualList style={{ height: '100%' }} count={messages.length} measured rowHeight={60}>
  {(i) => <Message message={messages[i]} />}
</VirtualList>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `count` | `number` | — | **Required.** |
| `children` | `(index: number) => ReactNode` | — | **Required.** Renders one row. |
| `getKey` | `(index) => Key` | the index | Use stable ids when the collection reorders. |
| `rowHeight` | `number` | `--onyx-row-height` | Exact for fixed rows, an estimate when `measured`. |
| `measured` | `boolean` | `false` | Measures each row's real height. |
| `overscan` | `number` | `4` | Extra rows rendered above and below the visible ones. |
| `activeIndex` | `number` | — | Kept rendered and scrolled into view, for `aria-activedescendant` patterns. |
| `enabled` | `boolean` | `true` | |
| `asChild` + `viewport` | | | With `asChild`, pass the custom root through `viewport` (since `children` is the row function). |

**`useVirtualList(options)`** returns `{ ref, virtualizer, virtualItems, totalSize, measureElement, scrollIntoView(index) }`. Attach `ref` to the scroll element and position the rows yourself.

**`calculateMeasuredVirtualWindow(heights, scrollTop, viewportHeight, overscan = 12)`** returns `{ start, end, before, after }`, for hosts that already track row heights.

Also exported: `virtualListVariants`.

## Behavior contract

**Onyx owns:** which rows are rendered, positioning, measuring, and keeping the active row mounted.

**You supply:** a viewport with a constrained height, the row content, and **all ARIA semantics** (list, grid, log, …). VirtualList adds none.

## Anatomy

`virtual-list`, `virtual-list-content`, `virtual-list-item` (`data-index`).

## Tokens read

`--onyx-row-height` (the default height estimate).

## Gotchas

- **Without a height, nothing scrolls.** The viewport needs an explicit or flex-constrained height, otherwise it grows to fit every row.
- **Rows must not change height unless you set `measured`.** Otherwise the positions drift.
