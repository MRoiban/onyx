# Checkbox

Checkbox renders one native input. Its forwarded ref, className, hidden and remaining native props all target that input. `data-slot="checkbox"`, `data-state="checked|unchecked|indeterminate"`, `data-disabled` and `data-invalid` expose native state. Checked and indeterminate indicators use a CSS mask on the input, colored with `--onyx-control-button-fg`. Set native `indeterminate` through the input ref; state hooks synchronize direct native assignments, changes and resets. Explicit props (including `disabled={false}`) win over Field context.
