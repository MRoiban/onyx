# Password Field

A password input with a show/hide button.

**Use when:** users enter a password, token or other secret.
**Not for:** one-time codes (use [OTP Field](otp-field.md)), or tokens shown read-only for copying (use [Input Group](input-group.md) with a copy button).

## Import

```tsx
import { PasswordField, usePasswordField } from '@mroiban/onyx/password-field';
```

## Example

```tsx
<Field invalid={!!error}>
  <Label>Password</Label>
  <PasswordField name="password" value={password} onChange={(event) => setPassword(event.target.value)} />
  <FieldError>{error}</FieldError>
</Field>

<PasswordField autoComplete="new-password" aria-label="New password" />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `revealed` / `defaultRevealed` / `onRevealedChange` | `boolean` | `false` | Whether the text is visible. |
| `autoComplete` | `string` | `'current-password'` | Use `'new-password'` on sign-up and change-password forms. |
| other | [Input](input.md) props | — | `value`, `onChange`, `name`, `form` and so on. `type` follows the reveal state. |

**`usePasswordField({ revealed, defaultRevealed, onRevealedChange })`** returns `{ revealed, setRevealed, toggle, reset }`.

Also exported: `passwordFieldVariants`.

## Behavior contract

**Onyx owns:** the reveal button (`aria-pressed`, labeled "Show password" / "Hide password"), switching the input type, keeping focus in the input when the button is clicked with a pointer, hiding the text again on form reset, and wiring to Field.

**You supply:** the label, the value and validation.

## Anatomy

`password-field` (an `input-group`), with `input-group-input`, `input-group-trailing` and `input-group-button` (reveal).

## Tokens read

[Input Group](input-group.md) and Button tokens.

## Gotchas

- **The button labels are in English.** "Show password" and "Hide password" are fixed text. Localize them by building your own control with `usePasswordField`.
