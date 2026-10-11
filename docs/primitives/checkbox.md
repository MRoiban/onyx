# Checkbox

A styled native checkbox (`<input type="checkbox">`) for turning one independent option on or off. It also supports the indeterminate "some selected" state.

**Use when:** an option can be on or off independently of others, usually inside a form that is submitted ("I agree", "Remember me").
**Not for:** a setting that applies immediately (use [Switch](switch.md)), several related checkboxes that share one value array or a select-all control (use [Checkbox Group](checkbox-group.md)), or one choice out of several (use [Radio Group](radio-group.md)).

## Import

```tsx
import { Checkbox } from '@mroiban/onyx/checkbox';
```

## Example

```tsx
<Field>
  <Inline gap="2" align="center">
    <Checkbox checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
    <Label>I agree to the terms</Label>
  </Inline>
</Field>

{/* or with a plain label */}
<label><Checkbox name="remember" defaultChecked /> Remember me</label>

{/* indeterminate */}
<Checkbox aria-checked="mixed" checked={false} onChange={selectAll} aria-label="Select all" />
```

## API

The props of a native `<input type="checkbox">`, except `type`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` / `defaultChecked` | `boolean` | — | Controlled or uncontrolled. |
| `onChange` | `(event) => void` | — | A native change event. Read `event.target.checked`. There is no `onCheckedChange`. |
| `aria-checked` | `'mixed' \| boolean` | — | `'mixed'` sets the native `indeterminate` flag for you. |
| `name`, `value`, `form`, `required` | native | — | Takes part in forms natively. |
| `disabled`, `aria-invalid`, `id` | native | from Field | |

The ref is the `<input>`. You can also set `ref.current.indeterminate = true` directly; the component notices.

Also exported: `checkboxClassName`.

## Behavior contract

**Onyx owns:** the box, check and dash styling (a CSS mask colored by `--onyx-control-button-fg`), keeping `data-state` in sync with the native state (including direct `indeterminate` assignments and form resets), and wiring to Field.

**You supply:** a label (a Field with a Label, a wrapping `<label>`, or `aria-label`) and the checked state.

## Anatomy

`checkbox` (`data-state="checked|unchecked|indeterminate"`, `data-disabled`, `data-invalid`).

## Tokens read

`--onyx-control-input-{bg,border}`, `--onyx-control-button-{bg,fg}`, `--onyx-control-focus-ring`, `--onyx-radius-sm`.

## Gotchas

- **It is a plain `<input>`.** Every prop, including `className` and `hidden`, applies to the input itself, which has no wrapper.
- **Form reset works.** A native `form.reset()` restores the default and keeps `data-state` correct. Controlled `checked` still wins.
- **Explicit props win over Field**, including `disabled={false}`.
