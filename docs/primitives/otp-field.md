# Otp Field

Public API: OTPField, useOTPField.

**Use when / Not for:** a short verification code needs distinct cells; not for passwords or arbitrary text.

**Anatomy (data-slot):** otp-field, otp-field-cell, otp-field-separator, otp-field-form-value.

**Props:** length (6), value/defaultValue/onValueChange, onComplete, pattern (digits), disabled, separatorAfter ([3]), separator (en dash), name/form, autoFocus. Paste/autofill distributes accepted characters from the active cell. Typing advances; Backspace clears current or previous empty cell; Delete clears; arrows/Home/End move cells. First cell has autocomplete=one-time-code. All cells have individual accessible labels and Field ARIA.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-otp-gap/cell-width/cell-height; control-input-*, control-focus-ring, font-mono, text-lg, radius-md, space-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useOTPField(options)` returns value, setValue, inputs ref, distribute(index,text), getCellProps(index).

**Composition exception:** `otp-field` generates multiple coordinated children, so its root does not support `asChild`. Use `useOTPField` to render a custom root and wire the returned state and handlers to your own parts; preserve the grouping roles, labels, keyboard behavior and form participation. The rendered component accepts root class/style and exposes `data-slot` hooks for each generated part.

The group inherits the Field label or its explicit `aria-label`. Cell names combine that name with “digit N of M”; without a group label cells use “Digit N of M”. IME input and navigation wait until `compositionend`. Native form reset restores the initial uncontrolled code, including an external `form` association.
