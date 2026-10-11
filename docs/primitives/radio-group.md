# Radio Group

Public API: RadioGroup, RadioGroupItem, RadioGroupIndicator.

**Use when / Not for:** exactly one mutually exclusive choice is needed; not for independently selected values.

**Anatomy (data-slot):** radio-group, radio-group-item, radio-group-control, radio-group-indicator, radio-group-label.

**Props:** Radix Root/Item/Indicator props, including value/defaultValue/onValueChange, name/form, required, disabled, orientation, dir, loop and asChild. Root variant="default"|"card". Item children label the complete option; no children gives a bare control for external labels. Radix owns roving focus, arrow selection and native form participation.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-radio-size, --onyx-radio-card-radius; control-input-*, control-button-*, control-focus-ring, tone-info-bg, radius-*, space-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Behavior is delegated to Radix RadioGroup; use its unstyled primitives for custom anatomy.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
