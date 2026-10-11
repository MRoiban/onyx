# Avatar · AvatarGroup

Use when: representing people with image or initials. Not for: sole accessible names of actions.

## Anatomy

`avatar`, `avatar-image`, `avatar-fallback`, `avatar-status`, `avatar-group`.

## Props and data attributes

Avatar name, src, alt, size sm/md/lg, variant circle/square, status, statusLabel; explicit AvatarImage/Fallback children supported. Radix hides image until loaded and falls back on failure. AvatarGroup max truncates to +N with accessible count. `data-size`, `data-variant`, status `data-tone`. Status remains outside the clipped image to keep its ring visible.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-avatar-{size,size-sm,size-lg,bg,fg,square-radius}`, `--onyx-avatar-group-overlap`, spacing, radius, status dot, tones.

## Headless hook

`getAvatarInitials(name)` NFC-normalizes names and takes the first grapheme of the first and last names using Intl.Segmenter. A single name uses one grapheme; empty names use ?. Emoji, flags and ZWJ sequences remain intact as the first grapheme. Without Segmenter, a Unicode regex preserves combining marks, flags, modifiers and ZWJ sequences. Radix owns image load behavior. [Radix Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).

Custom markup needs only `avatarVariants({size: "lg", variant: "square"})` for its visual styling. Optional `avatarAttributes({size: "lg", variant: "square"})` remains supported; `avatarAttributes()` defaults to md/circle.
