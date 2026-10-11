# Color Swatch

A color sample button. `ColorSwatchGroup` turns a set of swatches into a palette picker where one color is chosen.

**Use when:** choosing from a fixed set of colors (label colors, theme accents), or showing a color sample.
**Not for:** choosing any color (use [Color Picker](color-picker.md)), or status colors that carry meaning (use [Badge · StatusDot](badge.md)).

## Import

```tsx
import { ColorSwatch, ColorSwatchGroup } from '@onyx/ui/color-swatch';
```

## Example

```tsx
<Field>
  <Label>Label color</Label>
  <ColorSwatchGroup value={color} onValueChange={setColor} name="color">
    {palette.map((c) => <ColorSwatch key={c.hex} color={c.hex} aria-label={c.name} />)}
  </ColorSwatchGroup>
</Field>

{/* a sample that is not a control */}
<ColorSwatch asChild color="#3AA99F"><span aria-hidden /></ColorSwatch>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `ColorSwatch` | `color` | CSS color | — | **Required.** Inside a group, it is also the value. |
| | `selected` | `boolean` | from the group | Set it yourself for a standalone swatch. |
| | `disabled`, `asChild` | | | Without a group, a swatch is a `<button>`. |
| | `aria-label` | `string` | — | **Required.** Use the color's name, such as "Teal". |
| `ColorSwatchGroup` | `value` / `defaultValue` / `onValueChange` | `string` | — | |
| | `disabled`, `name`, `form`, `asChild` | | | `name` submits the chosen color. |

Also exported: `colorSwatchVariants`, `colorSwatchGroupVariants`.

## Behavior contract

**Onyx owns:** the radio-group pattern inside a group (`radiogroup` and `radio`, one tab stop, arrow keys that select), the selected ring, form submission, and restoring the default on form reset.

**You supply:** the colors and their names.

## Keyboard (in a group)

| Key | Result |
|---|---|
| Arrow keys | Move to and select the next or previous swatch |
| Home / End | First / last swatch |

## Anatomy

`color-swatch` (`data-state="selected|unselected"`, `data-disabled`), `color-swatch-group`, `color-swatch-form-value`.

## Tokens read

`--onyx-color-swatch-size`, `--onyx-border-{subtle,default}`, `--onyx-radius-xs`, `--onyx-surface-app`, `--onyx-control-focus-ring`, `--onyx-space-*`.

## Gotchas

- **Name the color, not the hex code.** "Teal" means more to a screen reader user than "#3AA99F".
