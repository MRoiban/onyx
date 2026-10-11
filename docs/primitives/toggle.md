# Toggle

Public API: Toggle.

**Use when / Not for:** a compact independent pressed action is needed; not for a setting switch or tabs.

**Anatomy (data-slot):** toggle, toggle-form-value.

**Props:** Radix Toggle props: pressed/defaultPressed/onPressedChange, disabled, asChild. size sm|md, variant default|outline. Optional name/form/value submits a hidden value only when pressed. aria-pressed and data-state=on|off come from Radix.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-toggle-height/radius; control-height-*, state-selected/selected-fg/hover, control-focus-ring, border-default, radius-sm, text-sm/muted. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Radix Toggle behavior with useControllableState; export toggleVariants.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
