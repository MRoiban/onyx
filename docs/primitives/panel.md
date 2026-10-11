# Panel rows

Use when rendering a styled collection row or composing a panel. Not for collection selection/keyboard behavior (use Listbox/Tree or their hooks).

Existing Panel, PanelHeader, PanelBody and PanelFooter exports remain. `ListRow` and `TreeRow` are now the visual layer consumed by Listbox and Tree. They forward refs/HTML props, merge classes, accept `asChild`, `selected`, `focused`, `disabled`, and expose `list-row` / `tree-row` slots. Callers can override `data-slot` for another collection's anatomy. `data-selected="true"`, `aria-selected="true"`, and legacy `data-state="active"` apply selection; `data-focused="true"` applies the inset focus border. Legacy active styling remains.

Tokens: row height, spacing, typography, radius, surface state and focus tokens listed in Listbox; TreeRow adds tree indent/depth styling. Exported cva functions: `listRowVariants`, `treeRowVariants`.

No headless model; use `useListbox` / `useTree` for behavior.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

`Panel` also accepts `variant="docked"` for workbench regions. The default `card` retains its rounded border and shadow; `docked` supplies the shared surface and flex container while the host chooses its edge borders and dimensions.
