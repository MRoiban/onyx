# Skeleton

Use when: a predictable loading placeholder. Not for: announcing loading (pair with Spinner or an aria-busy region).

## Anatomy

`skeleton`.

## Props and data attributes

shape text (alias text-line)/circle/rect, style for widths/heights. aria-hidden. `data-variant`, `data-state=loading`. Reduced motion removes shimmer.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-skeleton-{radius,height,size}`, state-hover/active, spacing, duration.

## Headless hook

None (presentation only).
