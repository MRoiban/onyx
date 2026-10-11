# Truncate

Use when: long names or paths in constrained rows. Not for: wrapping prose or essential hidden instructions.

## Public API

`truncateVariants`, `useTruncate`, `TruncateProps`, `Truncate`.

## Anatomy

`truncate`, `truncate-end`, `truncate-measure`, `truncate-start`, `truncate-text`.

## Props and state

text or string children; mode="end|middle", endCharacters (default 12), tooltipProps; asChild requires one element plus text. Default tabIndex becomes 0 only when overflowing.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-tooltip-radius`, `--onyx-surface-tooltip`, `--onyx-control-button-fg`, `--onyx-z-tooltip`, `--onyx-shadow-sm`.

## Headless behavior

useTruncate(text) returns ref, measureRef and overflowing. Attach both refs and measure the full text without width constraints. ResizeObserver observes text and available width; font readiness remeasures. Tooltip is rendered only when full text exceeds available width.

## References

[WAI-ARIA APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/), [Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip), [Floating UI autoUpdate](https://floating-ui.com/docs/autoupdate).

`data-mode="end|middle"` controls the visual mode; `data-state="idle|overflowing"` reports measurement. Middle mode retains the last `endCharacters` characters while the prefix ellipsizes. `asChild` requires one element and an explicit `text` prop. The measurement part is visually hidden and `aria-hidden`; the visible text retains its full accessible name. Truncate supplies its own TooltipProvider for standalone use.
