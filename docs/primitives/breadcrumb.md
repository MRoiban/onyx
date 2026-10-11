# Breadcrumb

Use when: showing hierarchy and the current page. Not for: primary site navigation.

## Anatomy

`breadcrumb`, `breadcrumb-list`, `breadcrumb-item`, `breadcrumb-link`, `breadcrumb-separator`, `breadcrumb-overflow`.

## Props and data attributes

items [{label,href,onClick}], maxItems (minimum 3), onOverflowClick; or compose the exported parts. nav has Breadcrumb label, ol/li, current item aria-current=page. Overflow uses W1 Menu with native links and keyboard handling; callback is notification, not a replacement for the menu. `data-slot` on all parts.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

text-description/foreground, space/radius, hover/focus; Menu reads overlay tokens.

## Headless hook

`useBreadcrumb(items,maxItems)` returns visible/hidden. [APG breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/).
