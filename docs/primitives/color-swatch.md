# Color Swatch

Public API: ColorSwatch, ColorSwatchGroup.

**Use when / Not for:** a color sample or a palette choice is needed; not for arbitrary color editing.

**Anatomy (data-slot):** color-swatch, color-swatch-group, color-swatch-form-value.

**Props:** Swatch requires color and supports selected, disabled, asChild, native button props and style. Group value/defaultValue/onValueChange, disabled, name/form, asChild. Group uses radiogroup/radio and roving focus; arrows/Home/End select focused swatch. Standalone swatch remains a button; render a noninteractive sample with asChild and suitable markup.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-color-swatch-size; border-subtle/default, radius-xs, surface-app, control-focus-ring, space-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** useRovingFocus and useControllableState supply headless group building blocks.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
