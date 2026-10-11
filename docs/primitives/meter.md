# Meter

Use when: a measurement in a meaningful bounded range. Not for: loading completion (Progress).

## Anatomy

`meter`, `meter-header`, `meter-label`, `meter-value`, `meter-track`, `meter-indicator`.

## Props and data attributes

value, min (0), max (100), low, high, optimum, tone override, label, valueText. Clamps finite values/range; native-meter-style thresholds infer success/warning/danger. Label references visible text; valueText maps to aria-valuetext; use aria-label without a visible label. `role=meter`, aria-valuemin/max/now, `data-tone`, `data-state=idle`. asChild puts meter semantics on the supplied element and delegates its visual children.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-track-height`, tone foreground, control-track, space/type/radius/motion.

## Headless hook

`useMeter({value,min,max,low,high,optimum,tone})` returns normalized min/max/value, percent, tone. [APG meter](https://www.w3.org/WAI/ARIA/apg/patterns/meter/).
