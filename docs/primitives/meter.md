# Meter

A bar showing a measurement within a known range, such as disk usage, quota or battery. It can turn green, yellow or red based on thresholds.

**Use when:** showing how full or how good something is: storage, CPU, password strength, rate-limit usage.
**Not for:** how far a task has progressed (use [Progress](progress.md)), or a value the user adjusts (use [Slider](slider.md)).

## Import

```tsx
import { Meter, useMeter } from '@onyx/ui/meter';
```

## Example

```tsx
<Meter label="Storage" value={used} max={quota} high={quota * 0.8} optimum={0} valueText={`${used} of ${quota} GB`} />

<Meter aria-label="Password strength" value={score} max={4} low={2} high={3} optimum={4} />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | — | **Required.** Clamped to `[min, max]`. |
| `min`, `max` | `number` | `0`, `100` | |
| `low`, `high`, `optimum` | `number` | — | Thresholds, as on the native `<meter>`, that set the tone (below). |
| `tone` | `DisplayTone` | inferred | Overrides the inferred tone. |
| `label` | `ReactNode` | — | Visible label above the bar. Otherwise pass `aria-label`. |
| `valueText` | `string` | — | Readable value ("12 of 50 GB"), shown and used as `aria-valuetext`. |
| `asChild` | `boolean` | `false` | Puts the meter semantics on your element. |

**Tone inference:** if `optimum` is below `low`, lower values are better (success ≤ low, warning ≤ high, danger above). If it is above `high`, higher values are better. Otherwise values between `low` and `high` are success and anything outside them is a warning.

**`useMeter({ value, min, max, low, high, optimum, tone })`** returns `{ min, max, value, percent, tone }`.

Also exported: `meterVariants`.

## Behavior contract

**Onyx owns:** clamping, the tone logic, `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`, and the bar.

**You supply:** the value, the thresholds and a label.

## Anatomy

`meter` (`data-tone`, `data-state`), `meter-header`, `meter-label`, `meter-value`, `meter-track`, `meter-indicator`.

## Tokens read

`--onyx-track-height`, `--onyx-control-track`, `--onyx-tone-*-fg`, space, type, radius and motion tokens.
