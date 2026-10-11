# Search Field

A search input with a magnifier icon, a clear (×) button that appears once there is text, and Escape to clear. You can add toggle buttons such as "Match case" or "Regex".

**Use when:** users type to filter or search a list, a tree, a page or results.
**Not for:** picking a value from options (use [Combobox](combobox.md)), running commands (use [Command](command.md)), or ordinary text entry (use [Input](input.md)).

## Import

```tsx
import { SearchField, useSearchField } from '@mroiban/onyx/search-field';
```

## Example

```tsx
<SearchField aria-label="Filter files" placeholder="Filter" value={query} onValueChange={setQuery} />

<SearchField
  aria-label="Find in file"
  value={query}
  onValueChange={setQuery}
  toggles={<>
    <Toggle size="sm" pressed={matchCase} onPressedChange={setMatchCase} aria-label="Match case"><Icon name="case-sensitive" /></Toggle>
    <Toggle size="sm" pressed={regex} onPressedChange={setRegex} aria-label="Use regular expression"><Icon name="regex" /></Toggle>
  </>}
/>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` / `onValueChange` | `string` | `''` | |
| `onChange` | native change handler | — | Runs first. Call `preventDefault()` to cancel the update. |
| `clearable` | `boolean` | `true` | Shows the × button while the field has text. |
| `toggles` | `ReactNode` | — | Shown before the clear button, usually [Toggles](toggle.md). |
| `name`, `form` | `string` | — | Submits the text natively. |
| other | [Input](input.md) props | — | `type` is always `"search"`. |

**`useSearchField({ value, defaultValue, onValueChange })`** returns `{ value, setValue, clear, onKeyDown, reset }`.

Also exported: `searchFieldVariants`.

## Behavior contract

**Onyx owns:** the icon, the clear button (which returns focus to the input), Escape clearing non-empty text, restoring the default on form reset, and wiring to Field.

**You supply:** the label (a Field with a Label, or `aria-label`), what the search does, and any debouncing.

## Anatomy

`search-field` (an `input-group`), with `input-group-leading` (the search `icon`), `input-group-input`, `input-group-trailing` and `input-group-button` (clear).

## Tokens read

[Input Group](input-group.md) and Button tokens.

## Gotchas

- **Escape on empty text is not handled.** It bubbles up, so an Escape in an empty field can still close a surrounding panel. That is usually what you want.
- **No debouncing.** `onValueChange` fires on every keystroke, so debounce expensive searches yourself.
