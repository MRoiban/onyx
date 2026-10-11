# Separator

Use when: dividing groups with optional text. Not for: drag handles (ResizeHandle).

## Anatomy

`separator`, `separator-label`.

## Props and data attributes

orientation horizontal/vertical, decorative (true), label. Semantic separators set role=separator and aria-orientation. Decorative ones set presentation. `data-orientation`, `data-variant=line|label`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-separator-{color,height}`, border-default, space/type.

## Headless hook

None.
