# Alert

Use when: inline or banner feedback without moving focus. Not for: confirmations requiring an answer (AlertDialog).

## Anatomy

`alert`, `alert-icon`, `alert-title`, `alert-description`, `alert-actions`, `alert-close`; optional AlertTitle/Description/Actions parts.

## Props and data attributes

tone, variant inline/banner, title, description, icon (null suppresses), actions, dismissible, onDismiss, dismissLabel, urgency polite/assertive, role override. Routine tones default to status; warning/danger default to alert because their message may need immediate attention. urgency overrides this choice. Dismissal never automatically expires. `data-tone`, `data-variant`, `data-state=open`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-alert-{padding-x,padding-y,radius}`, tones, spacing, muted text, focus.

## Headless hook

`useAlert(onDismiss)` returns dismissed/dismiss. [APG alert](https://www.w3.org/WAI/ARIA/apg/patterns/alert/).
