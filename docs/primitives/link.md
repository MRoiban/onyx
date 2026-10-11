# Link

Use when: navigating to a resource. Not for: commands (Button).

## Anatomy

`link`, `link-external-icon`.

## Props and data attributes

href and native anchor props, external (false), externalIcon (true), variant default/muted. external defaults target=_blank and rel=noopener noreferrer; explicit overrides retained. asChild composes router anchors and preserves the icon. `data-external`, `data-variant`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-link-color`, text-link/description, space/type, focus.

## Headless hook

None (native navigation).
