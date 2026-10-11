# Search Field

Public API: SearchField.

**Use when / Not for:** text search needs a clear action or find toggles; not for an option-selecting combobox.

**Anatomy (data-slot):** search-field, input-group-leading/trailing/input/button; icon.

**Props:** Input props plus value/defaultValue/onValueChange, onChange, toggles and clearable (true). Escape clears a nonempty input and prevents default. The clear button restores input focus. Native name/form submit search text. Type search; accessible name comes from Field Label or aria-label.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-input-height/radius; InputGroup and Button tokens; control-input-*, control-focus-ring. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** useSearchField exposes value/setValue, clear and keyboard bindings.

Native form reset silently restores the mount-time uncontrolled default, including controls associated with an external `form`. Controlled props remain authoritative.
