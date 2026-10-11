# Checkbox Group

Public API: CheckboxGroup, CheckboxGroupItem, CheckboxGroupSelectAll, useCheckboxGroup.

**Use when / Not for:** multiple native checkbox values need a shared selection model; not for mutually exclusive radio choices.

**Anatomy (data-slot):** checkbox-group, checkbox-group-item, checkbox-group-select-all.

**Props:** Root value/defaultValue/onValueChange: string[]. name/form, disabled, options (optional explicit select-all universe), asChild. Items require value and accept Checkbox props. Enabled mounted items otherwise define the universe. SelectAll sets native indeterminate and aria-checked=mixed for partial selection; unrelated values remain selected. Item name/form participate natively.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** control-input-*, control-button-*, control-focus-ring, space-*, radius-sm, text-sm. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useCheckboxGroup({value,defaultValue,onValueChange})` returns value, setValue, toggle(key,checked).

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
