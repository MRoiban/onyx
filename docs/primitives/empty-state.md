# EmptyState

Use when: a content area has nothing to display. Not for: errors requiring immediate announcement.

## Anatomy

`empty-state`, `empty-state-icon`, `empty-state-title`, `empty-state-description`, `empty-state-actions`.

## Props and data attributes

Preserved parts and native props; root adds tone, size sm/md/lg. asChild supported on parts. `data-tone`, `data-size`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-empty-state-bg`, tone border/foreground, surface-panel, spacing/type/radius, state-hover.

## Headless hook

None (presentation only).
