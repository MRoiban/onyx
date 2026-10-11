# Number Field

A numeric input with up/down stepper buttons, limits, step snapping and locale-aware formatting (currency, percent, units).

**Use when:** the user enters a number, usually within limits: a count, a size, a price or a percentage.
**Not for:** numbers that aren't quantities, such as phone numbers, IDs or ZIP codes (use [Input](input.md)), a value chosen by dragging (use [Slider](slider.md)), or an empty "no value" state (this field always holds a number).

## Import

```tsx
import { NumberField, useNumberField } from '@mroiban/onyx/number-field';
```

## Example

```tsx
<Field>
  <Label>Font size</Label>
  <NumberField value={size} onValueChange={setSize} min={8} max={72} step={1} unit="px" />
</Field>

<NumberField
  aria-label="Price"
  defaultValue={9.99}
  step={0.01}
  min={0}
  locale="fr-FR"
  formatOptions={{ style: 'currency', currency: 'EUR' }}
  name="price"
/>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` / `onValueChange` | `number` | `0` | |
| `min`, `max` | `number` | unbounded | |
| `step` | `number` | `1` | Values snap to `min + n × step`, or `n × step` when there is no `min`. |
| `unit` | `ReactNode` | — | A suffix such as `px` or `%`. |
| `locale`, `formatOptions` | Intl | the browser's locale | Used to format and to parse typed text. |
| `wheel` | `boolean` | `false` | Allow the mouse wheel to step the value while focused. |
| `disabled`, `readOnly` | `boolean` | from Field | |
| `name`, `form` | `string` | — | A hidden input submits the raw number. |
| `inputProps`, `inputRef` | | | Apply to the editable input. Prefer these to the forwarded `ref`. |
| `className`, `style`, `rootRef` | | | Apply to the root element. |

**`useNumberField(options)`** returns `value`, `text`, `setText`, `setValue`, `increment`, `decrement`, `commit`, `parse`, `format` and `inputProps`, which carries the spinbutton ARIA and the key, blur and wheel handlers.

Also exported: `numberFieldVariants`.

## Behavior contract

**Onyx owns:** the typed draft (committed on blur, Enter, stepping, or Home/End), parsing localized text, snapping and clamping, reverting text that can't be parsed, `role="spinbutton"` with `aria-valuenow` and `aria-valuetext`, the steppers, form submission, and restoring the default on form reset.

**You supply:** the limits, the step, the format and the label.

## Keyboard

| Key | Result |
|---|---|
| ↑ / ↓ | Step up / down |
| PageUp / PageDown | Ten steps |
| Home / End | Jump to `min` / `max` (only when they are set) |
| Enter | Commit the typed text |

## Anatomy

`number-field`, `number-field-input`, `number-field-unit`, `number-field-steppers`, `number-field-increment`, `number-field-decrement`, `number-field-form-value`.

## Tokens read

`--onyx-number-field-width`, `--onyx-number-field-stepper-width`, `--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-*`, `--onyx-control-focus-ring`, `--onyx-text-description`, `--onyx-space-*`.

## Gotchas

- **Clearing the field doesn't empty the value.** Empty or invalid text reverts to the last number, so there is no "no value" state. For optional numbers, use an Input and parse the text yourself.
- **The steppers are out of the tab order.** Keyboard users step with the arrow keys. Each stepper still keeps a 24px pointer target.
- **Supported formats:** standard notation in any locale, with currency, percent and localized digits. Scientific notation, compact notation ("1.2K"), spelled-out units and accounting parentheses are not parsed.
- **No `asChild` on the root.** The field generates its own children. For a custom layout, use `useNumberField`.
