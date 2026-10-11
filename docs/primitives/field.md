# Field

Public API: Field, Label, FieldDescription, FieldError, Fieldset, Legend, useFieldControl.

**Use when / Not for:** a control needs a label, guidance or validation; not for layout without a control.

**Anatomy (data-slot):** field, field-label, field-required, field-optional, field-description, field-error, fieldset, fieldset-legend.

**Props:** `Field`: id, required, disabled, invalid, asChild. `Label`: required, optional, htmlFor. Parts accept native props, className and forwarded refs. Explicit control attributes override context. Description/error IDs register and unregister as parts mount. Errors join aria-describedby only when Field is invalid.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-field-gap; text-sm/xs, text-foreground/description, tone-danger-fg, space-*, radius-md, border-default. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useFieldControl()` returns `{id, "aria-describedby", "aria-invalid", "aria-required", disabled}`. Input, Textarea, Checkbox, Switch and SelectTrigger consume it automatically. One Field owns one control; use Fieldset/Legend for multiple controls.

FieldError uses a polite, atomic live region, without role=alert. Keep the region mounted and update its text when possible, so errors do not interrupt ongoing speech. Validation errors remain linked through aria-describedby while invalid. Required marker is visual and aria-hidden; aria-required carries the semantic requirement. For native constraint validation, pass required to the control itself.

**Precedence and compound naming:** Explicit control props win over Field context, including `disabled={false}` inside `<Field disabled>`. An omitted or undefined disabled prop inherits the Field state. Label registers its ID; native controls and compound groups inherit `aria-labelledby`, `aria-describedby`, `aria-invalid` and `aria-required`. Explicit `aria-label` replaces the inherited label association, and explicit ARIA attributes override inherited ones. Slider forwards these attributes to its thumbs, Calendar to its grid, OTP to its group/cells, and ColorPicker to its group and editable parts.
