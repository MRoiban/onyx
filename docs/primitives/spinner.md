# Spinner

**Use when:** An operation is in progress. **Not for:** Known progress; use Progress or Meter.

## Anatomy

spinner. Parts forward refs and merge `className`.

## Props and attributes

`size`: xs/sm/md/lg; `label` (Loading by default), optional `tone`, `asChild`. Role status with an accessible label; decorative instances should set `aria-hidden` and clear role. Color inherits currentColor.

Parts expose `data-slot`; roots expose relevant `data-size`, `data-variant`, `data-tone`, `data-state`, `data-disabled` and `data-invalid`. User-supplied DOM attributes are forwarded.

## Tokens

All token names below have the `--onyx-` prefix: spinner-size-{xs,sm,md,lg}, spinner-width, spinner-width-xs, spinner-duration, radius-full.

## Hooks and variants

None; exports `spinnerVariants`.
