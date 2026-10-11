# Slider

A draggable control for choosing a number, or a range with two thumbs, within limits. It can show marks and the current value.

**Use when:** an approximate value is easier to choose by feel: volume, opacity, zoom, a price range.
**Not for:** exact numbers or wide ranges (use [Number Field](number-field.md)), or showing a value the user can't change (use [Meter](meter.md) or [Progress](progress.md)).

## Import

```tsx
import { Slider, SliderTrack, SliderRange, SliderThumb } from '@onyx/ui/slider';
```

## Example

```tsx
<Field>
  <Label>Opacity</Label>
  <Slider value={[opacity]} onValueChange={([v]) => setOpacity(v)} max={100} step={5} showValue formatValue={(v) => `${v}%`} />
</Field>

<Slider
  aria-label="Price range"
  defaultValue={[20, 80]}
  thumbLabels={['Minimum price', 'Maximum price']}
  marks={[0, { value: 50, label: '€50' }, 100]}
  onValueCommit={applyFilter}
/>
```

## API

Built on [Radix Slider](https://www.radix-ui.com/primitives/docs/components/slider).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` / `onValueChange` | `number[]` | `[0]` | **Always an array.** One number gives one thumb, two numbers give a range. |
| `onValueCommit` | `(value: number[]) => void` | — | Fires once when a drag or key press ends. Use it for expensive updates. |
| `min`, `max`, `step` | `number` | `0`, `100`, `1` | |
| `marks` | `(number \| { value; label })[]` | — | Tick marks, optionally labeled. |
| `showValue` | `boolean` | `false` | Shows the value above the slider. Ranges display as "20 – 80". |
| `formatValue` | `(value: number) => string` | `String` | |
| `thumbLabels` | `string[]` | — | One accessible name per thumb. Needed for ranges. |
| `orientation` | `'horizontal' \| 'vertical'` | horizontal | |
| `disabled`, `name`, `form`, `inverted`, `minStepsBetweenThumbs` | Radix | | |
| `children` | | default track, range and thumbs | Pass `SliderTrack`, `SliderRange` and `SliderThumb` to build your own. |

Also exported: `sliderVariants`, `sliderTrackVariants`, `sliderRangeVariants`, `sliderThumbVariants`.

## Behavior contract

**Onyx owns:** pointer and keyboard behavior, passing the Field's label and description to each thumb, the marks and value display, form submission, and restoring the default on form reset.

**You supply:** the limits, the step, value formatting, and thumb labels for ranges.

## Keyboard

| Key | Result |
|---|---|
| ← / ↓, → / ↑ | One step |
| PageUp / PageDown | A larger step |
| Home / End | `min` / `max` |

## Anatomy

`slider-container`, `slider-value` (`<output>`), `slider` (`data-orientation`, `data-disabled`), `slider-track`, `slider-range`, `slider-thumb`, `slider-marks`, `slider-mark`.

## Tokens read

`--onyx-slider-height`, `--onyx-slider-track-height`, `--onyx-slider-thumb-size`, `--onyx-slider-thumb-bg`, `--onyx-slider-vertical-height`, `--onyx-control-track`, `--onyx-control-focus-ring`, `--onyx-text-{inverse,description}`, `--onyx-space-*`, `--onyx-radius-full`, `--onyx-shadow-sm`.

## Gotchas

- **Destructure the array for a single value:** `onValueChange={([v]) => set(v)}` and `value={[v]}`.
- **Ranges need `thumbLabels`.** Otherwise both thumbs share the same name for screen readers.
