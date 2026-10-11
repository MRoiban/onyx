# Number Field

Public API: NumberField, useNumberField.

**Use when / Not for:** bounded numeric entry needs typed text and steppers; not for arbitrary text or phone numbers.

**Anatomy (data-slot):** number-field, number-field-input, number-field-unit, number-field-steppers, number-field-increment/decrement, number-field-form-value.

**Props:** value/defaultValue/onValueChange are numbers. min/max/step, unit, locale, formatOptions, wheel (false), disabled/readOnly and native input props. Draft typing commits on blur/Enter, stepping or boundary keys; snaps from min (zero when min is absent), clamps, and reverts unparseable text. ArrowUp/Down = step; PageUp/Down = 10 steps; Home/End = bounded edges. Steppers do not enter the tab sequence. A name/form hidden input submits the raw numeric value.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-number-field-width/stepper-width, --onyx-input-height/radius; control-input-*, control-focus-ring, text-description, space-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useNumberField(options)` returns value, text, setText, setValue, increment/decrement, commit, parse, format, and inputProps (spinbutton ARIA, editing, blur, key and opt-in wheel handlers).

Parsing uses Intl parts and localized digits for decimal, currency and percent displays. Scientific notation, compact notation, spelled-out units and accounting parentheses are outside the parser contract. Use standard notation and a separate unit suffix. Empty or invalid drafts revert to the prior numeric value; this primitive represents a number, not a nullable field.

**Composition exception:** `number-field` generates multiple coordinated children, so its root does not support `asChild`. Use `useNumberField` to render a custom root and wire the returned state and handlers to your own parts; preserve the grouping roles, labels, keyboard behavior and form participation. The rendered component accepts root class/style and exposes `data-slot` hooks for each generated part.

**Root and input channels:** `className`, `style` and `rootRef` target the root div. `inputProps` and `inputRef` target the editable input. The forwarded `ref` remains an input ref for compatibility; prefer `inputRef` for new code (legacy input prop placement is deprecated in favor of `inputProps`). Remaining top-level native input props remain supported. Consumer handlers run first and may cancel internal keyboard, blur or wheel behavior.

A valid draft drives `aria-valuenow` and `aria-valuetext`; empty and invalid drafts omit `aria-valuenow` and describe the draft in `aria-valuetext`. Controlled values remain authoritative after commit/stepping and on parent reassertion; only local in-progress typing retains a draft. Native form reset silently restores the mount-time uncontrolled number and formatted text, including external `form` association. Steppers keep their visible size and use token-based pseudo-elements for a minimum 24px hit area.
