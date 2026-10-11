# Button

**Use when:** Invoke an action. **Not for:** Navigation without an action; use Link.

## Anatomy

button, button-label, button-spinner, spinner. Parts forward refs and merge `className`.

## Props and attributes

`variant`: default/destructive/secondary/outline/ghost/link; `size`: xs/sm/md/lg/icon/icon-sm/icon-xs/native (default aliases md); `loading`, `pressed`, `asChild`, native button props. Loading adds `aria-busy` and a spinner, preserves the previously measured width, keeps the accessible label and suppresses clicks. Pressed maps to `aria-pressed` and on/off state. An initially loading button sizes naturally. A caller-supplied width always wins.

Parts expose `data-slot`; roots expose relevant `data-size`, `data-variant`, `data-tone`, `data-state`, `data-disabled` and `data-invalid`. User-supplied DOM attributes are forwarded.

## Tokens

All token names below have the `--onyx-` prefix: button-radius, button-height, button-font-weight; control-button/secondary/destructive colors; control-height-*; state-selected; spacing/focus tokens.

## Hooks and variants

None; exports `buttonVariants`.

## Compact target spacing

`xs` and `icon-xs` keep their visible control dimensions and enlarge the centered pointer target to at least `--onyx-space-6` (24px in the default theme). They reserve a margin on every side equal to half the positive difference between that target and `--onyx-control-height-xs`: 2px per side at compact density, zero at comfortable density. Adjacent compact buttons therefore reserve 4px between their visible boxes even in a zero-gap row, Toolbar group or InputGroup trailing area. Flex shrinking is disabled for these sizes. Keep these margins when composing controls; additional container gaps are additive. Removing the reserved margin or imposing negative spacing can make targets overlap neighbouring controls.
