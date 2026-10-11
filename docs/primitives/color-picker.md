# Color Picker

A full color editor: a saturation/brightness area, a hue slider, an optional opacity slider, and a hex input.

**Use when:** users can pick any color, for example custom theme colors or a drawing tool.
**Not for:** picking from a fixed palette (use [Color Swatch](color-swatch.md) groups). It is also not needed just to convert colors: the helpers below work without the component.

## Import

```tsx
import { ColorPicker, useColorPicker, hexToRgb, rgbToHex, hexToHsv, hsvToHex, rgbToHsv, hsvToRgb } from '@mroiban/onyx/color-picker';
```

## Example

```tsx
<Field>
  <Label>Accent color</Label>
  <ColorPicker value={accent} onValueChange={setAccent} />
</Field>

<ColorPicker aria-label="Fill" defaultValue="#3AA99F80" alpha name="fill" />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` / `defaultValue` / `onValueChange` | hex `string` | — | Accepts 3, 4, 6 or 8 digits. |
| `alpha` | `boolean` | `false` | Adds an opacity slider and 8-digit hex. |
| `disabled` | `boolean` | from Field | |
| `name`, `form` | `string` | — | A hidden input submits the hex value. |
| `className`, `style` | | | Apply to the root element. |

**`useColorPicker(options)`** returns `{ value, hsv, setValue(hex), update(partialHsv) }`.

**Helpers** (pure functions): `hexToRgb`, `rgbToHex`, `rgbToHsv`, `hsvToRgb`, `hexToHsv`, `hsvToHex`. RGB channels are 0–255; HSV uses h 0–360 and s, v, a 0–1. The `RGB` and `HSV` types are exported too.

Also exported: `colorPickerVariants`.

## Behavior contract

**Onyx owns:** the HSV editing model (hue and saturation are remembered even at zero brightness), pointer dragging on the area, keyboard access to the area through two hidden range inputs (Saturation and Brightness), the hue and opacity [Sliders](slider.md), keeping the hex draft while typing (committed on blur), form submission, and restoring the default on form reset.

**You supply:** the value and the label.

## Anatomy

`color-picker`, `color-picker-area`, `color-picker-thumb`, `color-picker-saturation`, `color-picker-brightness` (the hidden range inputs), `color-picker-hue`, `color-picker-alpha`, `color-picker-form-value`, plus Slider and Input Group slots.

## Tokens read

`--onyx-color-picker-width`, `--onyx-color-picker-area-height`, `--onyx-color-picker-{hue,white,black}`, `--onyx-radius-{md,full}`, `--onyx-space-*`, `--onyx-shadow-sm`, plus Slider and Input Group tokens.

## Gotchas

- **The value is always hex.** Convert it with the helpers for other formats.
- **An invalid hex draft stays visible** until blur, then reverts to the last valid color.
- **No `asChild` on the root.** For a custom layout, use `useColorPicker`.
