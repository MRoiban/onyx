# Toggle Group

Public API: ToggleGroup, ToggleGroupItem.

**Use when / Not for:** segmented actions select one or multiple pressed values; not for tab panels or labeled form radio choices.

**Anatomy (data-slot):** toggle-group, toggle-group-item, toggle-group-form-value.

**Props:** Required type="single"|"multiple". Radix props value/defaultValue/onValueChange, disabled, rovingFocus, orientation, dir, loop, asChild. Single uses string; multiple uses string[]. Item requires value. Optional name/form submits each selected value. Single can deselect to empty string. Root and item export cva functions.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** Toggle tokens; control-secondary-bg, control-height-sm, space-*, radius-md. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Radix ToggleGroup owns keyboard/selection; root state is exposed through controlled props.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
