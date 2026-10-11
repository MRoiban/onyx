# Card

Use when: a grouped content surface. Not for: nested clickable controls inside an asChild anchor.

## Anatomy

`card`, `card-header`, `card-title`, `card-description`, `card-body`, `card-footer`, `card-media`.

## Props and data attributes

interactive adds hover border; use asChild with an anchor for native focus/navigation. CardHeader/Title/Description/Body/Footer/Media are composable. `data-interactive`, `data-state=idle`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-card-{radius,border,bg,padding}`, surface-panel, borders, spacing, text/leading/weights, focus.

## Headless hook

None (presentation only).
