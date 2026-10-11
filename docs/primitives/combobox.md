# Combobox

A text input with a filtered dropdown of options. It handles single or multiple selection, can create new options, and shows the selected values as tags.

**Use when:** the list is long enough that typing to find an option helps, users may add a new value, or they pick several values (assignees, tags, languages).
**Not for:** a short list with no search (use [Select](select.md)), running commands (use [Command](command.md)), inline autocomplete inside a text editor, or huge server-side result sets that need virtualization (use [Listbox](listbox.md) with [VirtualList](virtual-list.md)).

## Import

```tsx
import { Combobox, useCombobox, ComboboxHighlight, type ComboboxOption } from '@mroiban/onyx/combobox';
```

## Example

```tsx
const languages: ComboboxOption[] = [
  { value: 'fr', label: 'French' },
  { value: 'en', label: 'English', description: 'Default' },
  { value: 'tlh', label: 'Klingon', disabled: true }
];

{/* single */}
<Combobox label="Language" options={languages} value={language} onValueChange={(v) => setLanguage(v as string)} placeholder="Search languages…" />

{/* multiple + create */}
<Combobox
  label="Tags"
  multiple
  options={tags}
  value={selected}
  onValueChange={(v) => setSelected(v as string[])}
  onCreate={(query) => createTag(query)}
  createOption={(query) => `Create “${query}”`}
/>

{/* server-side search */}
<Combobox label="User" options={results} filter={false} onInputValueChange={search} emptyState="No users found" />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `options` | `ComboboxOption[]` | — | **Required.** `{ value, label, disabled?, description? }`. Values must be unique. |
| `value` / `defaultValue` / `onValueChange` | `string` or `string[]` | `''` / `[]` | An array when `multiple`. Cast it in the handler. |
| `multiple` | `boolean` | `false` | Shows the selections as removable [Tags](tag.md). |
| `label` | `string` | — | A visible label. Otherwise pass `inputProps={{ 'aria-label': … }}`. |
| `placeholder` | `string` | — | |
| `inputValue` / `defaultInputValue` / `onInputValueChange` | `string` | — | The typed query. |
| `open` / `defaultOpen` / `onOpenChange` | `boolean` | `false` | |
| `filter` | `false \| (option, query) => boolean` | case-insensitive "label contains query" | `false` turns off client filtering, so you pass already-filtered `options`. |
| `onCreate` | `(query: string) => void` | — | Turns on a "create" row when nothing matches exactly. **You** add and select the new value. |
| `createOption` | `ReactNode \| (query) => ReactNode` | — | The create row's label. |
| `emptyState` | `ReactNode` | — | Shown when nothing matches. |
| `renderOption` | `(option, query) => ReactNode` | label with the match highlighted | |
| `renderSelected` | `(option, remove) => ReactNode` | a Tag | Custom chips in `multiple` mode. |
| `showTags` | `boolean` | `true` | |
| `disabled` | `boolean` | — | |
| `activeIndex` / `defaultActiveIndex` / `onActiveIndexChange` | `number` | `-1` | The keyboard-highlighted option. Rarely needed. |
| `container` | `HTMLElement \| null` | inherited | See [floating content in modals](README.md#floating-content-in-modals). |
| `className`, `style`, `rootProps`, `rootRef` | | | Apply to the root element. |
| `inputProps` | input attributes | — | Apply to the text input. |
| `contentClassName` | `string` | — | Applies to the dropdown. |
| `ref` | | | The `<input>`. |

**`useCombobox(options)`** is the same state model without the UI. It returns `value`, `selected`, `query`, `setQuery`, `open`, `setOpen`, `activeIndex`, `setActiveIndex`, `filteredOptions`, `canCreate`, `inputRef`, `inputProps`, `listboxProps`, `getOptionProps(index)`, `select(value)` and `remove(value)`. Spread the prop getters onto your own markup and keep DOM focus in the input.

**`ComboboxHighlight`** (`text`, `query`) highlights the first case-insensitive match with a `<mark>`, for use in custom `renderOption`.

Also exported: `comboboxVariants`.

## Behavior contract

**Onyx owns:** filtering, the ARIA combobox pattern (`aria-activedescendant` always points to a rendered, enabled option), keyboard navigation, selection, the create row, tags, the dropdown position, keeping labels in sync when options change, and moving into a surrounding Dialog automatically.

**You supply:** the options (and, with `filter={false}`, the filtering), creating new values, and the label.

## Keyboard

| Key | Result |
|---|---|
| ↓ / ↑ | Open the list, then move between enabled options |
| Enter | Select the highlighted option, or create one |
| Escape | Close without selecting |
| Tab | Close |
| Backspace, other editing keys | Edit the query normally |

## Anatomy

`combobox` (root), `combobox-label`, `combobox-control`, `combobox-chip`, `combobox-input`, `combobox-trigger`, `combobox-listbox`, `combobox-option` (`aria-selected`, `data-disabled`), `combobox-option-label`, `combobox-option-description`, `combobox-match`, `combobox-indicator`, `combobox-create-option`, `combobox-empty`, `combobox-separator`.

## Tokens read

`--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-bg`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`, plus Tag, Input and Button tokens.

## Gotchas

- **`onValueChange` receives `string | string[]`.** Cast it based on `multiple`.
- **Selecting a created value is up to you.** `onCreate` only reports the query. Add the option to `options` and update `value` yourself.
- **The typed query survives option reloads.** It is kept until blur or a selection, so async results don't wipe what the user typed.
- **The highlighted option follows its value**, not its position, when options reorder. If that option disappears, the highlight clears rather than jumping to a different option.
