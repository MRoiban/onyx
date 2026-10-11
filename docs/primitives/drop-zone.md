# Drop Zone

Public API: DropZone, useDropZone, acceptsFile.

**Use when / Not for:** local files need drop acceptance and keyboard browsing; not for item reordering or a server upload protocol.

**Anatomy (data-slot):** drop-zone, drop-zone-input.

**Props:** accept supports comma-separated extensions, exact MIME types and MIME wildcards; multiple (true), directory, maxSize (bytes), disabled, invalid, onFiles/onReject, name/form, asChild. Enter/Space and click open the dialog. Nested drag depth avoids flicker. Accepted drops invoke onFiles; any rejected file rejects the entire batch and invokes onReject. Dragover cannot reliably know extensions; validate names and size on drop. Native browse selections can submit through name/form; dropped files are provided via callback and must be uploaded by the app.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-drop-zone-radius/padding/border-width; border-strong, tone-info/danger-bg, tone-danger-fg, control-focus-ring, text-muted/description, space-*. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useDropZone(options)` returns isDropTarget, invalid, receive(files), dragProps. `acceptsFile({name,type},accept)` performs pure matching.
