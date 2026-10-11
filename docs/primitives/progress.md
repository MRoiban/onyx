# Progress

A bar that fills as a task completes. When the total isn't known it shows an indeterminate sweeping animation.

**Use when:** showing progress through an upload, a build, an import or a multi-step operation.
**Not for:** measurements such as storage or quota (use [Meter](meter.md)), short waits with no measurable progress inside a control (use [Spinner](spinner.md)), or placeholder content (use [Skeleton](skeleton.md)).

## Import

```tsx
import { Progress, getProgressPercent } from '@onyx/ui/progress';
```

## Example

```tsx
<Progress aria-label="Uploading notes.md" value={loaded} max={total} />
<Progress aria-label="Preparing build" indeterminate />
<Progress aria-label="Sync" value={pct} tone="success" />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | `0` | |
| `min`, `max` | `number` | `0`, `100` | |
| `indeterminate` | `boolean` | `false` | Leaves out `aria-valuenow` and animates. |
| `tone` | `DisplayTone` | `'info'` | |
| `indicatorClassName`, `indicatorStyle` | | — | Style the filled part. |
| `asChild` | `boolean` | `false` | |
| `aria-label` / `aria-labelledby` | | — | **Required.** |

**`getProgressPercent(value, min, max)`** is the clamped percentage calculation.

Also exported: `progressVariants`, `progressIndicatorVariants`, `progressClassName`, `progressIndicatorClassName`.

## Behavior contract

**Onyx owns:** `role="progressbar"` with min, max and now values, clamping, and the animations.

**You supply:** the value and a label.

## Anatomy

`progress` (`data-tone`, `data-state="determinate|indeterminate"`), `progress-indicator`.

## Tokens read

`--onyx-track-height`, `--onyx-control-track`, `--onyx-tone-*-fg`, radius and motion tokens.

## Gotchas

- **Show the number too.** A text percentage or "3 of 10 files" next to the bar helps everyone, and is essential when the bar is small.
