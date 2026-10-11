# Table

A styled semantic HTML table, with optional sortable column headers and selected-row styling.

**Use when:** presenting rows and columns of data to read and compare: deployments, files with sizes, usage.
**Not for:** spreadsheet-style grids with cell navigation or editing (that is a data grid, which Onyx doesn't provide), lists of choices (use [Listbox](listbox.md)), or layout (use [Grid](layout.md)).

## Import

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from '@mroiban/onyx/table';
```

## Example

```tsx
<Table>
  <TableCaption>Recent deployments</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead sort={sortKey === 'name' ? dir : 'none'} onSort={() => toggleSort('name')}>Pebble</TableHead>
      <TableHead>Status</TableHead>
      <TableHead sort={sortKey === 'date' ? dir : 'none'} onSort={() => toggleSort('date')}>Deployed</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {sorted.map((d) => (
      <TableRow key={d.id} selected={d.id === selectedId} onClick={() => setSelectedId(d.id)}>
        <TableCell>{d.name}</TableCell>
        <TableCell><Badge tone={d.ok ? 'success' : 'danger'}>{d.status}</Badge></TableCell>
        <TableCell>{formatDate(d.date)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `TableHead` | `sort` | `'ascending' \| 'descending' \| 'none'` | — | When set, the header becomes a sort button with an arrow, and the `th` gets `aria-sort`. |
| | `onSort` | `() => void` | — | **You** reorder the data and update `sort`. |
| | `sortButtonProps` | button props | — | |
| `TableRow` | `selected` | `boolean` | — | Visual state and `aria-selected`. You handle the selection events. |
| all parts | `asChild` + native table element props | | | For a custom sortable header, pass your own `th` as the child and Onyx puts the button inside it. |

Also exported: `tableVariants`.

## Behavior contract

**Onyx owns:** the table styling, the sort button and arrow, `aria-sort`, and the selected-row styling.

**You supply:** the data, the sort order, the selection logic and a caption.

## Anatomy

`table`, `table-caption`, `table-header`, `table-body`, `table-row` (`data-selected`, `data-state="selected|idle"`), `table-head`, `table-sort-button`, `table-sort-icon`, `table-cell`.

## Tokens read

Table type, spacing and border tokens, plus `--onyx-space-1` (sort button), `--onyx-state-{selected,selected-fg}`, and focus tokens.

## Gotchas

- **Clickable rows aren't keyboard accessible by themselves.** Put a button or link in a cell for keyboard users, or use a Listbox.
- **Large tables:** combine them with [`useFixedVirtualList`](fixed-virtual-list.md) inside a scroll container, rendering the padding as spacer rows.
