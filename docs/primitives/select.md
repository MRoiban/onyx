# Select

A button that opens a list of options and shows the one currently chosen. It is the styled version of a native `<select>`.

**Use when:** the user picks exactly one value from a short, known list (roughly 3–15 options), usually in a form.
**Not for:** long or searchable lists, creating new options or selecting several (use [Combobox](combobox.md)), 2–4 options that should all stay visible (use [Radio Group](radio-group.md) or [Toggle Group](toggle-group.md)), running commands (use [Menu](menu.md)), or switching sections in a sidebar header (use [SectionSelect](section-select.md)).

## Import

```tsx
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectItem, SelectGroup, SelectLabel, SelectSeparator
} from '@onyx/ui/select';
import { Field, Label } from '@onyx/ui/field';
```

## Example

```tsx
<Field>
  <Label>Language</Label>
  <Select value={language} onValueChange={setLanguage}>
    <SelectTrigger>
      <SelectValue placeholder="Choose a language" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Common</SelectLabel>
        <SelectItem value="en" leading={<Icon name="globe" />}>English</SelectItem>
        <SelectItem value="fr">French</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectItem value="tlh" disabled trailing={<Badge>Soon</Badge>}>Klingon</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

## API

Built on [Radix Select](https://www.radix-ui.com/primitives/docs/components/select). Every Radix prop passes through.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Select` | `value`, `defaultValue`, `onValueChange` | `string` | — | |
| | `open`, `onOpenChange`, `disabled`, `required`, `name` | Radix | — | `name` adds a hidden native input for form submission. |
| `SelectTrigger` | `aria-invalid`, `disabled` | — | from `Field` | Inside a [Field](field.md), it takes the field's id, label, description, invalid and disabled state automatically. |
| `SelectValue` | `placeholder` | `ReactNode` | — | Shown when no value is set. |
| `SelectContent` | `position` | `'popper' \| 'item-aligned'` | **`'popper'`** | `popper` drops the list below the trigger, at least as wide as the trigger. |
| `SelectItem` | `value` | `string` | — | **Required, and must not be an empty string.** |
| | `leading` | `ReactNode` | — | A 16px slot before the label, for an icon or swatch. |
| | `trailing` | `ReactNode` | — | Right-aligned content, such as a badge or count. |
| | `disabled`, `textValue` | Radix | — | Set `textValue` when the label is not plain text, so typeahead still works. |
| `SelectGroup` / `SelectLabel` / `SelectSeparator` | — | — | — | Use these to group options. |

## Behavior contract

**Onyx owns:** the trigger with its chevron, the check mark on the selected item, keyboard navigation and typeahead, collision-aware placement, scrolling within the available height, wiring to Field, and **copying the trigger's font into the list**, so the list text matches the trigger even when the app overrides fonts.

**You supply:** the options and the value.

## Anatomy

`select-trigger`, `select-content`, `select-viewport`, `select-label`, `select-item`, `select-item-leading`, `select-item-trailing`, `select-separator`. The trigger exposes `data-invalid`, `data-state` and `data-placeholder`. Items expose `data-highlighted`, `data-disabled` and `data-state="checked"`.

## Tokens read

`--onyx-control-height-md`, `--onyx-control-input-{bg,fg,border}`, `--onyx-control-focus-ring`, `--onyx-shadow-{sm,md}`, `--onyx-surface-menu`, `--onyx-border-default`, `--onyx-radius-{sm,md}`, `--onyx-text-{md,sm}`, `--onyx-text-{foreground,muted,description}`, `--onyx-state-selected{,-fg}`, `--onyx-z-popover`, `--onyx-scale-ui`.

## Gotchas

- **Radix rejects `value=""`.** To express "none", leave the value `undefined` so the placeholder shows, or use a sentinel such as `"none"`.
- **Set the trigger's width yourself.** The trigger is `w-full`. In toolbars, give it a width with `className`.
- **No search.** Once users need to type to find an option, switch to Combobox.
