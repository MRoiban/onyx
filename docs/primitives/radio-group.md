# Radio Group

A set of options where exactly one can be chosen. It comes as classic radio buttons or as selectable cards.

**Use when:** the user picks one of 2–6 options and seeing them all at once helps them compare (plan tier, export format).
**Not for:** many options or limited space (use [Select](select.md)), any number of options (use [Checkbox Group](checkbox-group.md)), compact view or mode switches in a toolbar (use [Toggle Group](toggle-group.md) with `type="single"`), or switching panels (use [Tabs](tabs.md)).

## Import

```tsx
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from '@onyx/ui/radio-group';
```

## Example

```tsx
<Field>
  <Label>Export format</Label>
  <RadioGroup value={format} onValueChange={setFormat} name="format">
    <RadioGroupItem value="pdf">PDF</RadioGroupItem>
    <RadioGroupItem value="md">Markdown</RadioGroupItem>
    <RadioGroupItem value="html" disabled>HTML</RadioGroupItem>
  </RadioGroup>
</Field>

<RadioGroup variant="card" defaultValue="pro" orientation="horizontal">
  <RadioGroupItem value="free"><strong>Free</strong> Up to 3 projects</RadioGroupItem>
  <RadioGroupItem value="pro"><strong>Pro</strong> Unlimited projects</RadioGroupItem>
</RadioGroup>
```

## API

Built on [Radix Radio Group](https://www.radix-ui.com/primitives/docs/components/radio-group).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `RadioGroup` | `value` / `defaultValue` / `onValueChange` | `string` | `''` | |
| | `variant` | `'default' \| 'card'` | `'default'` | `card` draws each item as a bordered card. |
| | `orientation` | `'horizontal' \| 'vertical'` | — | Sets which arrow keys move between items. |
| | `name`, `form`, `required`, `disabled`, `loop`, `dir` | Radix | — | Submits with forms natively. |
| `RadioGroupItem` | `value` | `string` | — | **Required.** |
| | `children` | `ReactNode` | — | The label, and the whole item is clickable. Leave it out for a bare radio labeled from elsewhere. |
| | `disabled`, `asChild` | | — | With `asChild`, you render the whole item yourself. |
| `RadioGroupIndicator` | Radix | — | — | For custom items built with `asChild`. |

Also exported: `radioGroupVariants`, `radioGroupItemVariants`, `radioGroupIndicatorVariants`.

## Behavior contract

**Onyx owns:** focus moving between items with the arrow keys (which also selects), keeping exactly one selected, native form submission, restoring the default on form reset, the card and default styling, and wiring to Field.

**You supply:** the options, their labels, and the value.

## Anatomy

`radio-group` (`data-variant`, `data-invalid`, `data-orientation`), `radio-group-item` (`data-state="checked|unchecked"`, `data-variant`, `data-disabled`), `radio-group-control`, `radio-group-indicator`, `radio-group-label`.

## Tokens read

`--onyx-radio-size`, `--onyx-radio-card-radius`, `--onyx-control-input-*`, `--onyx-control-button-*`, `--onyx-control-focus-ring`, `--onyx-tone-info-bg` (selected card), `--onyx-radius-*`, `--onyx-space-*`.

## Gotchas

- **Only one item is in the tab order.** Tab enters the group, and the arrow keys move between items and select them as they go. This is standard radio behavior.
- **There is no "none" option after a choice.** Users cannot clear a selection. If "none" is valid, add it as an option.
