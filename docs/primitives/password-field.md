# Password Field

Public API: PasswordField.

**Use when / Not for:** secret entry needs a reveal control; not for ordinary text or one-time codes.

**Anatomy (data-slot):** password-field, input-group-leading/input/trailing/button.

**Props:** Input props including value/defaultValue/onChange/name/form. revealed/defaultRevealed/onRevealedChange control visibility. Reveal button uses aria-pressed and Show password/Hide password labels. Pointer toggling retains input focus; keyboard toggling retains normal button focus. Type is controlled by reveal state; default autocomplete=current-password.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** InputGroup and Button tokens; --onyx-input-height/radius; control-input-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** usePasswordField exposes revealed/setRevealed and toggle behavior.
