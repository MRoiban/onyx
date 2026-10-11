# OTP Field

A row of single-character cells for a short verification code, such as a 6-digit sign-in code. It supports paste and SMS autofill.

**Use when:** users enter a one-time code from an email, SMS or authenticator app.
**Not for:** passwords (use [Password Field](password-field.md)), or text of any length (use [Input](input.md)).

## Import

```tsx
import { OTPField, useOTPField } from '@onyx/ui/otp-field';
```

## Example

```tsx
<Field invalid={!!error}>
  <Label>Verification code</Label>
  <OTPField length={6} value={code} onValueChange={setCode} onComplete={verify} autoFocus name="code" />
  <FieldError>{error}</FieldError>
</Field>

{/* letters and digits, grouped 4-4 */}
<OTPField aria-label="Recovery code" length={8} pattern={/[A-Z0-9]/} separatorAfter={[4]} />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `length` | `number` | `6` | |
| `value` / `defaultValue` / `onValueChange` | `string` | `''` | |
| `onComplete` | `(value: string) => void` | — | Fires when every cell is filled. A good place to submit automatically. |
| `pattern` | `RegExp` | digits | Tested on each character. Other characters are ignored. |
| `separatorAfter` | `number[]` | `[3]` | Cell positions after which a separator appears. |
| `separator` | `ReactNode` | `–` | |
| `disabled`, `autoFocus` | `boolean` | | |
| `name`, `form` | `string` | — | A hidden input submits the full code. |
| `className`, `style` | | | Apply to the root element. |

**`useOTPField(options)`** returns `{ value, setValue, inputs, distribute(index, text), getCellProps(index) }`.

Also exported: `otpFieldVariants`.

## Behavior contract

**Onyx owns:** moving to the next cell as you type, spreading pasted or autofilled text from the active cell onward, `autocomplete="one-time-code"` on the first cell, a label on each cell ("Verification code, digit 2 of 6"), waiting for IME input to finish, form submission, and restoring the default on form reset.

**You supply:** the label, checking the code, and the error.

## Keyboard

| Key | Result |
|---|---|
| A character | Fill the cell and move to the next |
| Backspace | Clear the cell, or the previous one if this cell is empty |
| Delete | Clear the cell |
| ← / → / Home / End | Move between cells |

## Anatomy

`otp-field` (`role="group"`), `otp-field-cell` (`data-state="filled|empty"`), `otp-field-separator`, `otp-field-form-value`.

## Tokens read

`--onyx-otp-gap`, `--onyx-otp-cell-width`, `--onyx-otp-cell-height`, `--onyx-control-input-*`, `--onyx-control-focus-ring`, `--onyx-font-mono`, `--onyx-text-lg`, `--onyx-radius-md`, `--onyx-space-*`.

## Gotchas

- **The default `pattern` accepts digits only.** Pass your own `pattern` for codes with letters.
- **No `asChild` on the root.** The field generates its cells. For a custom layout, use `useOTPField`.
