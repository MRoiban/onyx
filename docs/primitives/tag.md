# Tag · TagGroup

Use when: removable selected values. Not for: standalone navigation or a selectable listbox.

## Anatomy

`tag`, `tag-label`, `tag-remove`, `tag-group`.

## Props and data attributes

Tag tone, disabled, onRemove, removeLabel (defaults to Remove + string label). TagGroup is a labelled group, one roving tab stop; arrows/Home/End move, Click, Enter, Space, Backspace and Delete removal restore focus to the next tag, otherwise the previous tag. If empty, TagGroup calls `onEmpty` (which may focus a consumer control), then tries `fallbackRef`, then the group itself (tabIndex=-1). Controlled/asynchronous DOM removals also restore focus. Consumer owns the values. `data-tone`, `data-disabled`, `data-state=idle`.

Every DOM part forwards its ref, merges `className`, and supports `asChild` (unless explicitly noted). Exported `*Variants` cva functions supply base and modifier classes: their options style custom markup without requiring data attributes. Components also emit data attributes for integration hooks. Optional `displayAttributes({tone, variant, size, state, orientation, interactive, pulse})` from `badge` and the specialized `badgeAttributes`/`avatarAttributes` helpers continue to style markup through the same CSS rules. Supply semantic ARIA separately. All styling is in `src/styles/display.css`, inside `onyx.components`. Component variables use semantic fallbacks; override them on an ancestor or with `style`. Theme and density inherit from any ancestor.

## Tokens read

`--onyx-tag-{height,radius,bg,fg}`, `--onyx-tag-group-gap`, spacing, control-secondary, state-active, tones, focus.

## Headless hook

`useTagGroup({onEmpty, fallbackRef})` returns ref, onKeyDown, onFocusCapture, refresh, getItems. Attach root bindings. Removal activates the focused remove button.
