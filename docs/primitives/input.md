# Input · Textarea

Text boxes. `Input` takes a single line, and `Textarea` takes multiple lines.

**Use when:** the user types free text, such as a name, title, URL or comment.
**Not for:** search boxes with a clear button (use [Search Field](search-field.md)), passwords (use [Password Field](password-field.md)), numbers with steppers (use [Number Field](number-field.md)), verification codes (use [OTP Field](otp-field.md)), text with a prefix, suffix or inline button (wrap it in [Input Group](input-group.md)), or choosing from options (use [Select](select.md) or [Combobox](combobox.md)).

## Import

```tsx
import { Input } from '@mroiban/onyx/input';
import { Textarea } from '@mroiban/onyx/textarea';
import { Field, Label, FieldDescription, FieldError } from '@mroiban/onyx/field';
```

## Example

Put it inside a [Field](field.md) so the label, description, error and invalid state connect automatically:

```tsx
<Field invalid={!!error} required>
  <Label>Project name</Label>
  <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="my-pebble" />
  <FieldDescription>Lowercase letters and dashes.</FieldDescription>
  <FieldError>{error}</FieldError>
</Field>

<Field>
  <Label>Notes</Label>
  <Textarea rows={4} value={notes} onChange={(event) => setNotes(event.target.value)} />
</Field>
```

## API

| Component | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Input` | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The visual height. The native numeric `size` attribute is not available. |
| | `type` | string | `'text'` | |
| `Textarea` | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Changes only the font size. Set the height with `rows` or `className`. |
| both | `asChild` | `boolean` | `false` | |
| both | `aria-invalid`, `disabled`, `id`, `aria-*` | native | from Field | Any prop you pass explicitly overrides the Field's value. |
| both | other | native `<input>` / `<textarea>` props | — | Use controlled (`value` and `onChange`) or uncontrolled (`defaultValue`) as with native elements. |

Also exported: `inputVariants`, `textareaVariants`, and `textareaClassName` for compatibility.

## Behavior contract

**Onyx owns:** the border, background, focus and invalid styling, and taking the id, label, description, invalid, required and disabled state from a surrounding Field.

**You supply:** the value, the change handler, validation, and either a Field with a Label or your own `aria-label`.

## Anatomy

`input` / `textarea`, each with `data-size`, `data-invalid` and `data-disabled`.

## Tokens read

`--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-height-{sm,md,lg}`, `--onyx-control-input-{bg,fg,border}`, `--onyx-control-focus-ring`, `--onyx-tone-danger-fg`, `--onyx-textarea-min-height`, `--onyx-text-{sm,md,lg}`, `--onyx-text-description` (placeholder), `--onyx-space-{1,2,10}`.

## Gotchas

- **Width is 100%.** Both fill their container, so constrain the width with layout or `className`.
- **Field's `disabled` can be overridden.** `disabled={false}` on the control enables it inside `<Field disabled>`. Leaving the prop out inherits the Field's state.
- **`aria-label` replaces the Field label.** When you pass `aria-label`, the control stops pointing to the Field's Label.
