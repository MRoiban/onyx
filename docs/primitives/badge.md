# Badge · Count · StatusDot

Use when: compact status, numeric counts, or presence. Not for: actionable buttons or essential status conveyed by color alone.

## Anatomy

`badge`, `badge-icon`, `count`, `status-dot`.

## Props and data attributes

`Badge`: tone neutral/info/success/warning/danger, variant subtle/solid/outline, icon. `Count`: value, max (99), variant subtle/solid/outline (solid default), normalized full number as accessible label; negative/nonfinite values render 0 and finite values truncate to non-negative integers. max truncates to an integer; nonfinite values and values below 1 disable the cap. Tabular numbers. `StatusDot`: tone, pulse, label (omit for decorative use). `data-tone`, `data-variant`, `data-state=pulsing|idle`, `data-pulse`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-badge-{radius,gap,height,padding,text-size}`, `--onyx-count-{size,text-size,font-weight}`, `--onyx-status-dot-{size,duration}`, tone sets, space/type/weight/radius.

## Headless hook

Pure helpers `formatCount(value,max)`; dots need no state hook.

Custom markup: `<span className={badgeVariants({tone: "danger", variant: "outline"})}>Error</span>`. No companion attributes are required. `badgeAttributes()` remains available and defaults to neutral/subtle. Other roots accept their visual options directly: `countVariants({tone: "danger", variant: "outline"})`, `statusDotVariants({tone: "success", pulse: true})`, `linkVariants({variant: "muted"})`, and `skeletonVariants({shape: "circle"})`. Attribute helpers only address styling and integration hooks; supply semantic ARIA separately.
