# Field

Wraps one form control with its label, help text and error message, and connects them for accessibility automatically. `Fieldset` and `Legend` group several controls under one heading.

**Use when:** any form control needs a visible label, a description or validation.
**Not for:** page layout without a control (use [Stack · Inline · Grid](layout.md)), or several controls under one label (use `Fieldset` and `Legend`, or [Radio Group](radio-group.md) or [Checkbox Group](checkbox-group.md)).

## Import

```tsx
import { Field, Label, FieldDescription, FieldError, Fieldset, Legend, useFieldControl } from '@mroiban/onyx/field';
```

## Example

```tsx
<Field invalid={!!emailError} required>
  <Label>Email</Label>
  <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
  <FieldDescription>We only use it for sign-in.</FieldDescription>
  <FieldError>{emailError}</FieldError>
</Field>

<Fieldset>
  <Legend>Notifications</Legend>
  <Field><Label>Email</Label><Switch /></Field>
  <Field><Label>Push</Label><Switch /></Field>
</Fieldset>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Field` | `invalid` | `boolean` | `false` | Marks the control invalid and links `FieldError` to it. |
| | `required` | `boolean` | `false` | Sets `aria-required` and shows `*` on the Label. |
| | `disabled` | `boolean` | `false` | Passed down to the control. |
| | `id` | `string` | generated | Becomes the control's `id`. |
| | `asChild` | `boolean` | `false` | |
| `Label` | `required` | `boolean` | from Field | Shows the `*` marker, hidden from assistive technology. |
| | `optional` | `boolean` | — | Shows an "Optional" hint. |
| `FieldDescription` | `<p>` props | — | — | Always linked through `aria-describedby`. |
| `FieldError` | `<p>` props | — | — | Polite live region with an error icon. Linked only while the Field is `invalid`. |
| `Fieldset` / `Legend` | native props, `asChild` | — | — | A native `fieldset`, so `disabled` disables every control inside it. |

**`useFieldControl(overrides?)`** returns `{ id, 'aria-labelledby', 'aria-describedby', 'aria-invalid', 'aria-required', disabled }` for the nearest Field. Spread it onto a custom control so it works inside a Field.

## Behavior contract

**Onyx owns:** generating and connecting ids (label, description and error), turning invalid, required and disabled into ARIA and data attributes, and the error live region.

**These controls connect automatically:** Input, Textarea, Search Field, Password Field, Number Field, Input Group, Checkbox, Checkbox Group, Radio Group, Switch, Toggle, Toggle Group, SelectTrigger, Color Swatch, Slider (on its thumbs), Calendar (on its grid), OTP Field (on its group and cells) and ColorPicker (on its group and editable parts).

**You supply:** the label text, the validation logic and the error message.

## Anatomy

`field` (`data-invalid`, `data-disabled`, `data-required`), `field-label`, `field-required`, `field-optional`, `field-description`, `field-error`, `fieldset` (`data-disabled`), `fieldset-legend`.

## Tokens read

`--onyx-field-gap`, `--onyx-text-{xs,sm}`, `--onyx-text-{foreground,description}`, `--onyx-tone-danger-fg`, `--onyx-space-*`, `--onyx-radius-md`, `--onyx-border-default`.

## Gotchas

- **One Field holds one control.** For several controls, use `Fieldset` and `Legend`.
- **Explicit props win.** `disabled={false}` on a control enables it inside `<Field disabled>`, and explicit `aria-*` overrides the Field's values. Passing `aria-label` removes the link to the Label.
- **Keep `FieldError` mounted and change its text.** Mounting and unmounting it repeatedly interrupts screen readers, so render `<FieldError>{error}</FieldError>` and let it be empty when there is no error.
- **`required` on Field is only semantic.** It sets `aria-required` but not native constraint validation. For the browser's own validation, pass `required` to the control itself.
