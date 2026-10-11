# Switch

Switch exposes `data-slot="switch"` and `switch-thumb`, checked/unchecked state, data-disabled and data-invalid. Explicit disabled props win over Field context. Native reset restores its initial uncontrolled checked state, including external `form` association.

Track geometry follows density through `--onyx-control-height-md` and spacing tokens. Override `--onyx-switch-track-width`, `--onyx-switch-track-height`, `--onyx-switch-padding` and `--onyx-switch-thumb-size`; thumb travel is computed from track width, padding and thumb size. `--onyx-switch-thumb-travel` overrides that computed distance.
