# Listbox

Use when choosing one or several options in a collection. Not for rows containing independent buttons or links (use a grid or ordinary list).

Anatomy: `listbox`, `listbox-content`, `listbox-virtual-row`, `listbox-option`, `listbox-group`, `listbox-group-label`. `ListRow` supplies the option visual layer.

`Listbox<T>` takes `items`, `getKey`, `getText`, `isDisabled`, `selectionMode="single|multiple|none"`, `selectedKeys` / `defaultSelectedKeys`, `onSelectionChange`, `focusedKey` / `defaultFocusedKey`, `onFocusChange`, `renderItem(item, {selected, focused})`, `getGroup`, `virtualized`, and optional `rowHeight`. Keys are unique strings/numbers. Give the root `aria-label` or `aria-labelledby`. With `asChild`, supply the custom root as `children`; Onyx inserts its generated options into that element. `ListboxGroup` takes a required `label` and labels its ARIA group.

Focus stays on the root using **aria-activedescendant**. Focus and selection are distinct; arrows, Home/End and buffered typeahead move focus. Enter selects; Space toggles multi-selection. Click selects, Shift extends from the anchor, Cmd/Ctrl toggles, and Cmd/Ctrl+A selects enabled options. Shift+navigation extends the range. Disabled options are skipped. Virtualization keeps the active descendant mounted even outside the current range and publishes `aria-posinset` / `aria-setsize`. Grouped virtualization includes separate heading rows and named ARIA groups for mounted options; typeahead and selection continue to operate only on options. Virtual heading height uses the row token.

State: option `data-selected="true|false"`, `data-focused="true|false"`, `data-disabled`, `data-state="selected|idle"`, `aria-selected`, `aria-disabled`; root `data-orientation="vertical"`.

Tokens: `--onyx-row-height`, `--onyx-space-{0-5,1-5}`, `--onyx-radius-{sm,md}`, `--onyx-surface-panel`, `--onyx-border-default`, `--onyx-text-{foreground,muted,description,xs,sm}`, `--onyx-state-{hover,selected,selected-fg}`, `--onyx-control-focus-ring`, `--onyx-focus-ring-{width,offset}`, `--onyx-weight-semibold`.

Headless: `useListbox<T>(options)` returns the collection, selection/focus state and setters, `select(key, modifiers)`, `itemId`, `onKeyDown`, `getRootProps()`, and `getItemProps(item)`. The caller attaches these bindings and supplies its own row rendering/scrolling. `listboxVariants` and `listRowVariants` are exported.

[APG listbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

Focus-only navigation resets the range anchor; Shift navigation extends from the previously focused row. Refining a typeahead prefix retains the current match; a new search or repeated-character cycle starts after it. `getItemProps` position lookup uses a memoized key/index map. Custom `rowHeight` sets the viewport `--onyx-row-height` for matching row height and minimum height.
