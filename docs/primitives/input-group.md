# Input Group

Public API: InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton, InputGroupSeparator.

**Use when / Not for:** an input has a prefix, suffix or embedded action; not for unrelated toolbars.

**Anatomy (data-slot):** input-group, input-group-leading, input-group-trailing, input-group-addon, input-group-input, input-group-button, input-group-separator.

**Props:** InputGroup supports leading/trailing React nodes, invalid, disabled and asChild. InputGroupInput accepts Input props and consumes Field. InputGroupButton accepts Button props (ghost/icon-xs defaults). Addons and separators support asChild. Root disability styles the group; also disable nested controls or wrap in a disabled Field.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-input-height/radius; control-input-bg/border/fg, control-focus-ring, tone-danger-fg, space-*, text-sm. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Field supplies aria state. Composition is intentionally stateless; useFieldControl is available for custom input markup.
