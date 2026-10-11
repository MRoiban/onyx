# File Trigger

Public API: FileTrigger.

**Use when / Not for:** a button opens a native file dialog; not for drag-and-drop feedback.

**Anatomy (data-slot):** file-trigger, file-trigger-input; composed Button slots.

**Props:** Button props (including asChild) plus accept, multiple, directory, onFiles(File[]), name/form. Directory emits webkitdirectory. Native hidden input retains selected files for form submission when named; unnamed selections reset input so the same file can be selected again. Browser accept is a dialog hint; validate files with DropZone or application code.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** Button tokens; --onyx-button-height/radius; button size variants use --onyx-space-* for padding. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** Native file input provides behavior; forwarded ref targets the trigger button.
