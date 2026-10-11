# Checkbox Group

A set of checkboxes that share one `string[]` value, with an optional "select all" checkbox that shows a partial state.

**Use when:** the user picks any number of options from a list (file types to include, notification channels).
**Not for:** exactly one choice (use [Radio Group](radio-group.md)), a single on/off option (use [Checkbox](checkbox.md) or [Switch](switch.md)), compact pressed buttons (use [Toggle Group](toggle-group.md) with `type="multiple"`), or long searchable lists (use [Combobox](combobox.md) with multiple selection, or [Listbox](listbox.md)).

## Import

```tsx
import { CheckboxGroup, CheckboxGroupItem, CheckboxGroupSelectAll, useCheckboxGroup } from '@mroiban/onyx/checkbox-group';
```

## Example

```tsx
<Field>
  <Label>Include</Label>
  <CheckboxGroup value={types} onValueChange={setTypes} name="types">
    <label><CheckboxGroupSelectAll /> All</label>
    <label><CheckboxGroupItem value="md" /> Markdown</label>
    <label><CheckboxGroupItem value="ts" /> TypeScript</label>
    <label><CheckboxGroupItem value="bin" disabled /> Binary</label>
  </CheckboxGroup>
</Field>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `CheckboxGroup` | `value` / `defaultValue` / `onValueChange` | `string[]` | `[]` | |
| | `options` | `string[]` | the enabled items that are mounted | The set that "select all" covers. Pass it when not every item is mounted. |
| | `name`, `form` | `string` | — | Every item submits its value under `name`. |
| | `disabled` | `boolean` | from Field | Disables every item. |
| | `asChild` | `boolean` | `false` | |
| `CheckboxGroupItem` | `value` | `string` | — | **Required.** Accepts all other [Checkbox](checkbox.md) props. |
| | `disabled` | `boolean` | from the group | Disabled items are left out of "select all". |
| `CheckboxGroupSelectAll` | Checkbox props | — | — | Checked when every option is selected, indeterminate (`aria-checked="mixed"`) when some are. |

**`useCheckboxGroup({ value, defaultValue, onValueChange })`** returns `{ value, setValue, toggle(key, checked), reset }`, the same state model without the UI.

## Behavior contract

**Onyx owns:** the selection array (with no duplicates), the select-all calculation and its indeterminate state, native form submission and reset, and wiring to Field.

**You supply:** the options, their labels, and the value.

## Anatomy

`checkbox-group` (`role="group"`, `data-disabled`, `data-invalid`), `checkbox-group-item`, `checkbox-group-select-all`. Each is a [Checkbox](checkbox.md) with `data-state="checked|unchecked|indeterminate"`.

## Tokens read

Checkbox tokens, plus `--onyx-space-*` and `--onyx-text-sm`.

## Gotchas

- **Select-all only touches its own options.** Selected values outside `options` stay selected when you select or clear all.
- **Every item needs a label.** Wrap it in a `<label>` or give it `aria-label`. The group's Field label only names the group.
- **Form reset restores the value from the first mount.** Controlled `value` still wins.
