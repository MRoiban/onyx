# Color Picker

Public API: ColorPicker, useColorPicker; hexToRgb, rgbToHex, rgbToHsv, hsvToRgb, hexToHsv, hsvToHex.

**Use when / Not for:** HSV color editing and hexadecimal entry are needed; not for a simple predefined palette.

**Anatomy (data-slot):** color-picker, color-picker-area, color-picker-thumb, color-picker-saturation/brightness, color-picker-hue, color-picker-alpha, color-picker-form-value; composed Slider/InputGroup slots.

**Props:** Hex string value/defaultValue/onValueChange; alpha, disabled, name/form. Pointer area adjusts saturation/value. Two visually hidden native range controls expose Saturation and Brightness keyboard adjustment, with focus visible on the area. Hue and optional opacity use Slider. Hex input retains invalid drafts until blur. Pure helpers use RGB 0–255 and HSV h 0–360, s/v/a 0–1. Hex accepts 3/4/6/8 digits.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-color-picker-width/area-height/hue/white/black; radius-md/full, space-*, shadow-sm; composed Slider/InputGroup tokens. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useColorPicker(options)` returns value, hsv, setValue(hex), update(partialHSV). Helpers also live in src/lib/color.ts and are re-exported through color-picker. Mathematical spectrum colors are data, independent of UI theme.

**Composition exception:** `color-picker` generates multiple coordinated children, so its root does not support `asChild`. Use `useColorPicker` to render a custom root and wire the returned state and handlers to your own parts; preserve the grouping roles, labels, keyboard behavior and form participation. The rendered component accepts root class/style and exposes `data-slot` hooks for each generated part.

The picker retains editable HSV coordinates when brightness or saturation reaches zero; raising brightness restores the chosen hue/saturation. External hex changes reconcile the editable coordinates. Native form reset restores the initial uncontrolled color, including external `form` association.
