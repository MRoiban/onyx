# NumberEffect

Shows a number that rolls to its new value: the old value slides out as the new one slides in. Use it for counters and stats that update while the user watches.

**Use when:** a visible count or metric changes, and showing that it changed helps the user (unread counts, totals, live stats).
**Not for:** numbers the user edits (use [Number Field](number-field.md)), progress toward a goal (use [Progress](progress.md) or [Meter](meter.md)), or values that change many times a second, where the animation becomes noise.

## Import

```tsx
import { NumberEffect } from '@onyx/ui/number-effect';
```

## Example

```tsx
const currency = new Intl.NumberFormat('en', { style: 'currency', currency: 'EUR' });

<NumberEffect value={unread} />
<NumberEffect value={balance} format={(value) => currency.format(value)} />
<NumberEffect value={rank} direction="down" aria-label={`Rank ${rank}`} />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | — | **Required.** `NaN` and `Infinity` display as `0`. |
| `format` | `(value: number) => string` | `String` | Formats both the old and the new value. |
| `direction` | `'auto' \| 'up' \| 'down'` | `'auto'` | `auto` rolls up when the value increases and down when it decreases. |
| `aria-label` | `string` | the formatted value | |
| `aria-live` | `'polite' \| 'assertive' \| 'off'` | `'polite'` | Set `'off'` for values that change often. |
| other | `<span>` props | — | |

Headless helpers: `normalizeNumberEffectValue`, `resolveNumberEffectDirection(previous, next, direction)`, `formatNumberEffectValue(value, format)`. The CSS class names are exported too (`numberEffectClassName` and the others).

## Behavior contract

**Onyx owns:** the roll animation, a stable width that never jumps while digits change (tabular numbers and a hidden sizer as wide as the longer of the two values), announcing the change to screen readers, and honoring reduced motion.

**You supply:** the value and its formatting. Font, size and color come from the parent.

## Anatomy

`<span data-slot="number-effect" data-value data-direction>` wraps a hidden sizer and a viewport holding the outgoing and incoming values. Classes: `onyx-number-effect`, `__sizer`, `__viewport`, `__value`, `__value--{static,enter,exit}`.

## Tokens read

`--onyx-number-effect-duration` (default `180ms`). Set it on the element or an ancestor to change the speed.

## Gotchas

- **The animation is driven by `value`, not by the text you see.** It runs whenever `value` changes (compared with `Object.is`). If `format` rounds both the old and new values to the same text, the number still rolls, from identical text to identical text. Round `value` yourself to avoid this.
- **The line height is fixed at `1`**, with each value clipped to a 1em viewport. Align the number with its neighbors through the parent's layout, not through `line-height`.
