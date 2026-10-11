# Input Group

An input with attached extras that share one border: a leading icon or text (`https://`), a trailing unit (`px`), or small inline buttons (copy, clear, reveal).

**Use when:** a text input needs a prefix, suffix or embedded action.
**Not for:** search with a clear button (use [Search Field](search-field.md), which is built on this), passwords (use [Password Field](password-field.md)), numbers with steppers (use [Number Field](number-field.md)), or a row of unrelated controls (use [Toolbar](toolbar.md) or [Inline](layout.md)).

## Import

```tsx
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton, InputGroupSeparator } from '@mroiban/onyx/input-group';
```

## Example

```tsx
<Field>
  <Label>Website</Label>
  <InputGroup leading={<InputGroupAddon>https://</InputGroupAddon>}>
    <InputGroupInput value={site} onChange={(event) => setSite(event.target.value)} />
  </InputGroup>
</Field>

<InputGroup
  leading={<Icon name="key" size="sm" />}
  trailing={<InputGroupButton aria-label="Copy token" onClick={copy}><Icon name="copy" /></InputGroupButton>}
>
  <InputGroupInput readOnly value={token} aria-label="API token" />
</InputGroup>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `InputGroup` | `leading`, `trailing` | `ReactNode` | — | Content before and after the input. |
| | `invalid` | `boolean` | from Field or `aria-invalid` | Styles the whole group. |
| | `disabled` | `boolean` | from Field | Styles the group only. See the gotchas. |
| | `asChild` | `boolean` | `false` | With `asChild`, you render the leading and trailing parts yourself. |
| `InputGroupInput` | all [Input](input.md) props | | | Takes its state from Field. |
| `InputGroupButton` | all [Button](button.md) props | | `variant: 'ghost'`, `size: 'icon-xs'` | |
| `InputGroupAddon`, `InputGroupSeparator` | `asChild` | | | Static text or icon, and a divider. |

Also exported: `inputGroupVariants`, `inputGroupAddonVariants`, `inputGroupInputVariants`, `inputGroupButtonVariants`, `inputGroupSeparatorVariants`.

## Behavior contract

**Onyx owns:** the shared border, the focus ring around the whole group, the invalid and disabled styling, and spacing. The group holds no state.

**You supply:** the input's value, button actions, and labels for icon buttons.

## Anatomy

`input-group` (`data-invalid`, `data-disabled`), `input-group-leading`, `input-group-trailing`, `input-group-addon`, `input-group-input`, `input-group-button`, `input-group-separator`.

## Tokens read

`--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-{bg,border,fg}`, `--onyx-control-focus-ring`, `--onyx-tone-danger-fg`, `--onyx-space-*`, `--onyx-text-sm`.

## Gotchas

- **`disabled` on the group only changes its look.** Also disable the input and buttons, or wrap everything in `<Field disabled>`, which does both.
- **Trailing buttons keep a 24px target.** `icon-xs` buttons reserve margin around themselves (see [Button](button.md#gotchas)). Don't remove it.
