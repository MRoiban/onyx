# Table

Use when presenting ordinary semantic tabular data. Not for data-grid keyboard navigation, cell editing, filtering or sorting the data model.

Anatomy: existing `table`, `table-header`, `table-body`, `table-row`, `table-head`, `table-cell`, `table-caption`; new `table-sort-button`, `table-sort-icon`.

`TableHead` adds `sort="ascending|descending|none"`, `onSort`, and `sortButtonProps`. Supplying sort renders a real button with an arrow affordance and publishes `aria-sort` on the th. The callback is responsible for changing the data ordering and the sort prop. Omit sort to retain a plain header. `TableRow` adds `selected`, mapping to `data-selected`, `data-state="selected|idle"` and `aria-selected`; the application owns selection events. All parts support `asChild`; for a composed sortable header, pass the custom th as the child and Onyx inserts the sort button inside it. All existing exports and HTML prop forwarding remain. `tableVariants` is exported.

Tokens: existing table type/spacing/border tokens; sort button uses `--onyx-space-1`; selected row uses `--onyx-state-{selected,selected-fg}`; focus uses public focus-ring tokens.

No new headless model: sorting and selection logic remain consumer-owned.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.
