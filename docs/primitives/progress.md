# Progress

Use when: determinate or indeterminate task completion. Not for: storage or quota measurements (Meter).

## Anatomy

`progress`, `progress-indicator`.

## Props and data attributes

Preserved value/min/max, indicatorClassName/indicatorStyle and getProgressPercent. Adds indeterminate, tone (info), asChild. `role=progressbar`; indeterminate omits aria-valuenow. Supply accessible label. `data-tone`, `data-state=determinate|indeterminate`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-track-height`, control-track, tone foreground, radius/motion.

## Headless hook

`getProgressPercent(value,min,max)` is the pure calculation helper.
