# Listbox

A keyboard-navigable list of options for selecting one or many items, with typeahead, Shift and Ctrl/⌘ range selection, optional groups and virtualization for long lists.

**Use when:** users pick one or several items from a visible list: a file list, a recipient list, the items in a picker panel.
**Not for:** rows that contain their own buttons or links (use an ordinary list or [Table](table.md)), hierarchies (use [Tree](tree.md)), a compact dropdown (use [Select](select.md) or [Combobox](combobox.md)), or commands (use [Menu](menu.md) or [Command](command.md)).

## Import

```tsx
import { Listbox, ListboxGroup, useListbox, type CollectionKey } from '@mroiban/onyx/listbox';
```

## Example

```tsx
<Listbox
  aria-label="Files"
  items={files}
  getKey={(f) => f.path}
  getText={(f) => f.name}
  isDisabled={(f) => f.locked}
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
  getGroup={(f) => f.folder}
  virtualized
  renderItem={(f, { selected }) => (
    <Inline gap="2"><Icon name="file" /> <Truncate>{f.name}</Truncate> {selected && <Icon name="check" />}</Inline>
  )}
/>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `readonly T[]` | — | **Required.** |
| `getKey` | `(item) => string \| number` | — | **Required.** Keys must be unique. |
| `getText` | `(item) => string` | `String(key)` | Used for typeahead. |
| `isDisabled` | `(item) => boolean` | none disabled | Disabled items are skipped. |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'single'` | |
| `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange` | `CollectionKey[]` | `[]` | |
| `focusedKey` / `defaultFocusedKey` / `onFocusChange` | `CollectionKey \| null` | — | The keyboard focus, which is separate from the selection. |
| `renderItem` | `(item, { selected, focused }) => ReactNode` | the text | The content of each row. |
| `getGroup` | `(item) => string` | — | Groups items under headings. |
| `virtualized` | `boolean` | `false` | Renders only the visible rows. |
| `rowHeight` | `number` (px) | `--onyx-row-height` | Required to match custom row styling when virtualized. |
| `aria-label` / `aria-labelledby` | | — | **Required.** |
| `asChild` | `boolean` | `false` | Pass a custom root as `children`, and Onyx fills it with the options. |

**`ListboxGroup`** (`label` required) is for building groups yourself.

**`useListbox(options)`** returns the selection and focus state and setters, `select(key, modifiers)`, `itemId`, `onKeyDown`, `getRootProps()` and `getItemProps(item)`. You render the rows and handle scrolling.

Also exported: `listboxVariants`. Rows use `ListRow` and `listRowVariants` from [Panel](panel.md).

## Behavior contract

**Onyx owns:**
- DOM focus stays on the root (`aria-activedescendant`).
- Arrow, Home and End navigation, and buffered typeahead.
- Selection with the modifier keys below.
- Skipping disabled items.
- With virtualization, keeping the focused row mounted and publishing `aria-posinset` and `aria-setsize`.

**You supply:** the items, the keys, the row content and the selection state.

## Keyboard and pointer

| Input | Result |
|---|---|
| ↑ / ↓ / Home / End | Move focus |
| Shift + ↑ / ↓ | Extend the selection (multiple) |
| Type characters | Typeahead to the next match |
| Enter | Select |
| Space | Toggle (multiple) |
| Ctrl/⌘+A | Select all enabled options (multiple) |
| Click / Shift+click / Ctrl/⌘+click | Select / extend from the anchor / toggle |

## Anatomy

`listbox` (`data-orientation="vertical"`), `listbox-content`, `listbox-virtual-row`, `listbox-option` (`aria-selected`, `data-selected`, `data-focused`, `data-disabled`, `data-state="selected|idle"`), `listbox-group`, `listbox-group-label`.

## Tokens read

`--onyx-row-height`, `--onyx-space-{0-5,1-5}`, `--onyx-radius-{sm,md}`, `--onyx-surface-panel`, `--onyx-border-default`, `--onyx-text-{foreground,muted,description,xs,sm}`, `--onyx-state-{hover,selected,selected-fg}`, `--onyx-control-focus-ring`, `--onyx-focus-ring-{width,offset}`, `--onyx-weight-semibold`.

## Gotchas

- **Options must not contain interactive elements.** Focus stays on the root, so buttons inside rows can't be reached by keyboard.
- **Focus and selection are separate.** Moving with the arrow keys does not select in `multiple` mode. Listen to `onSelectionChange`, not `onFocusChange`, for the value.
