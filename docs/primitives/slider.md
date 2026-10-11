# Slider

Public API: Slider, SliderTrack, SliderRange, SliderThumb.

**Use when / Not for:** a numeric amount or interval is easier to choose by adjustment; not for exact long numeric entry.

**Anatomy (data-slot):** slider-container, slider, slider-track, slider-range, slider-thumb, slider-value, slider-marks, slider-mark.

**Props:** Radix Slider props including number[] value/defaultValue/onValueChange, min/max/step, disabled, orientation, name/form, onValueCommit. Multiple values render multiple thumbs. marks accepts numbers or {value,label}; showValue, formatValue and thumbLabels add display/accessible labels. Children may replace default track/range/thumb composition. Radix owns pointer and APG keyboard semantics.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-slider-height/track-height/thumb-size/thumb-bg/vertical-height; control-track, control-focus-ring, text-inverse/description, space-*, radius-full, shadow-sm. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Radix owns the headless slider behavior; controlled values use useControllableState.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
