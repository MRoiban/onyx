# Toggle Group

A row of [Toggle](toggle.md) buttons that share one value: one pressed at a time (`single`) or any number (`multiple`). It often appears as a segmented control.

**Use when:** switching a mode or view in a toolbar (List / Grid, Left / Center / Right align), or toggling several formatting options together (Bold / Italic / Underline).
**Not for:** switching between content panels (use [Tabs](tabs.md)), a labeled choice in a form (use [Radio Group](radio-group.md) or [Checkbox Group](checkbox-group.md)), or a single on/off button (use [Toggle](toggle.md)).

## Import

```tsx
import { ToggleGroup, ToggleGroupItem } from '@mroiban/onyx/toggle-group';
```

## Example

```tsx
<ToggleGroup type="single" value={layout} onValueChange={(next) => next && setLayout(next)} aria-label="Layout">
  <ToggleGroupItem value="list" aria-label="List"><Icon name="list-flat" /></ToggleGroupItem>
  <ToggleGroupItem value="grid" aria-label="Grid"><Icon name="layout" /></ToggleGroupItem>
</ToggleGroup>

<ToggleGroup type="multiple" value={marks} onValueChange={setMarks} aria-label="Formatting">
  <ToggleGroupItem value="bold">B</ToggleGroupItem>
  <ToggleGroupItem value="italic">I</ToggleGroupItem>
</ToggleGroup>
```

## API

Built on [Radix Toggle Group](https://www.radix-ui.com/primitives/docs/components/toggle-group).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `ToggleGroup` | `type` | `'single' \| 'multiple'` | — | **Required.** |
| | `value` / `defaultValue` / `onValueChange` | `string` (single) or `string[]` (multiple) | `''` / `[]` | |
| | `rovingFocus` | `boolean` | `true` | One tab stop, with the arrow keys moving between items. |
| | `orientation`, `dir`, `loop`, `disabled` | Radix | — | |
| | `name`, `form` | `string` | — | Submits one hidden input per selected value. |
| `ToggleGroupItem` | `value` | `string` | — | **Required.** |
| | `disabled`, `asChild` | | — | Items use Toggle's styling. |

Also exported: `toggleGroupVariants`, `toggleGroupItemVariants`.

## Behavior contract

**Onyx owns:** the selection state, the arrow-key focus behavior, form submission and reset, and wiring to Field.

**You supply:** the items, their labels, and a group `aria-label`.

## Anatomy

`toggle-group` (`data-orientation`, `data-invalid`), `toggle-group-item` (`data-state="on|off"`, `data-disabled`), `toggle-group-form-value` (hidden inputs).

## Tokens read

[Toggle](toggle.md) tokens, plus `--onyx-control-secondary-bg`, `--onyx-control-height-sm`, `--onyx-space-*`, `--onyx-radius-md`.

## Gotchas

- **A `single` group can end up empty.** Clicking the pressed item deselects it and sends `''`. When the group must always have a value, ignore empty values, as the first example does (`next && setLayout(next)`).
- **Icon-only items need `aria-label`.**
