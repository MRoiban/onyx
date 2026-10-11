# Stack · Inline · Container · Grid

Use when: layout and spacing should work without application CSS. Not for: domain-specific shells.

## Anatomy

`stack`, `inline`, `container`, `grid`.

## Props and data attributes

Stack gap (3), align, justify, direction (column); Inline gap (2), align (center), justify, wrap (true). Container size sm/md/lg/full and padding (4). Grid gap (3), columns (1), minChildWidth auto-fill. Gap/padding steps: 0-5,1,1-5,2,3,4,5,6,8,10. Only explicitly supplied values populate inline component custom properties; defaults live in CSS fallbacks and inherit ancestor overrides; explicit style overrides merge last. `data-direction`, `data-wrap`, `data-size`, `data-variant=columns|auto-fill`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-stack-{gap,align,justify,direction}`, `--onyx-inline-{gap,align,justify,wrap}`, `--onyx-container-{padding,max-width}`, `--onyx-grid-{gap,columns}`, space scale. sm=35×space-4, md=48×space-4, lg=64×space-4.

## Headless hook

`spaceValue(step)` returns the corresponding token reference; no state hook.
