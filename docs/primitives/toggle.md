# Toggle

A small button that stays pressed or unpressed, such as **Bold** or "Word wrap" in a toolbar.

**Use when:** one compact action stays on or off, usually in a [Toolbar](toolbar.md) or editor header.
**Not for:** a labeled setting in a form or settings page (use [Switch](switch.md)), a set of related pressed options (use [Toggle Group](toggle-group.md)), or switching panels (use [Tabs](tabs.md)).

## Import

```tsx
import { Toggle } from '@mroiban/onyx/toggle';
```

## Example

```tsx
<Toggle pressed={wrap} onPressedChange={setWrap} aria-label="Word wrap">
  <Icon name="word-wrap" />
</Toggle>

<Toggle variant="outline" size="md" defaultPressed name="pinned" value="yes">Pinned</Toggle>
```

## API

Built on [Radix Toggle](https://www.radix-ui.com/primitives/docs/components/toggle).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `pressed` / `defaultPressed` / `onPressedChange` | `boolean` | — / `false` | |
| `size` | `'sm' \| 'md'` | `'sm'` | |
| `variant` | `'default' \| 'outline'` | `'default'` | |
| `name`, `form`, `value` | `string` | `value: 'on'` | When `name` is set, a hidden input submits `value`, but **only while pressed**. |
| `disabled`, `asChild` | | from Field | |

Also exported: `toggleVariants`.

## Behavior contract

**Onyx owns:** `aria-pressed`, `data-state="on|off"`, the pressed styling, optional form submission, restoring the default on form reset, and wiring to Field.

**You supply:** the label (`aria-label` when there is only an icon) and what pressing it does.

## Anatomy

`toggle` (`data-state`, `data-size`, `data-variant`, `data-disabled`, `data-invalid`), `toggle-form-value` (a hidden input, present only when `name` is set and the toggle is pressed).

## Tokens read

`--onyx-toggle-height`, `--onyx-toggle-radius`, `--onyx-control-height-*`, `--onyx-state-{selected,selected-fg,hover}`, `--onyx-control-focus-ring`, `--onyx-border-default`, `--onyx-radius-sm`, `--onyx-text-sm`, `--onyx-text-muted`.

## Gotchas

- **Keep the label fixed.** Screen readers announce the pressed state for you, so a label like "Bold" works when pressed and unpressed. Changing the label to "Unbold" when pressed doubles up the announcement.
