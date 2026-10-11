# Switch

An on/off toggle drawn as a sliding track and thumb. A change takes effect immediately, like a light switch.

**Use when:** a setting turns on or off and applies right away ("Show hidden files", "Dark mode").
**Not for:** an option that applies only when a form is submitted (use [Checkbox](checkbox.md)), a pressed toolbar action (use [Toggle](toggle.md)), or choosing between more than two states (use [Radio Group](radio-group.md) or [Toggle Group](toggle-group.md)).

## Import

```tsx
import { Switch } from '@mroiban/onyx/switch';
```

## Example

```tsx
<Field>
  <Inline justify="between" align="center">
    <Label>Show hidden files</Label>
    <Switch checked={showHidden} onCheckedChange={setShowHidden} />
  </Inline>
</Field>

<Switch aria-label="Autosave" defaultChecked />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `checked` / `defaultChecked` | `boolean` | — / `false` | Controlled or uncontrolled. |
| `onCheckedChange` | `(checked: boolean) => void` | — | |
| `onClick` | `(event) => void` | — | Runs first. Call `event.preventDefault()` to cancel the toggle. |
| `disabled`, `aria-invalid`, `id` | — | from Field | |
| `form` | `string` | — | Resets with that form. |
| other | `<button>` props | — | `type` defaults to `"button"`. |

Also exported: `switchTrackClassName`, `switchThumbClassName`.

## Behavior contract

**Onyx owns:** `role="switch"` with `aria-checked`, the track and thumb animation, sizing by density, wiring to Field, and restoring the initial uncontrolled state on form reset (including forms linked through `form`).

**You supply:** a label (a Field with a Label, or `aria-label`) and what the setting does.

## Anatomy

`switch` (a `<button>` with `data-state="checked|unchecked"`, `data-disabled`, `data-invalid`), `switch-thumb` (`data-state`).

## Tokens read

`--onyx-switch-track-width`, `--onyx-switch-track-height`, `--onyx-switch-padding`, `--onyx-switch-thumb-size`, `--onyx-switch-thumb-travel` (computed from the other four unless you set it), `--onyx-control-height-md`, `--onyx-control-input-border` (off track), `--onyx-control-button-{bg,fg}` (on track and thumb), `--onyx-control-focus-ring`, `--onyx-shadow-sm`.

## Gotchas

- **It is a `<button>`, not a checkbox.** It submits no form value. If a form needs the value, add your own hidden input or use Checkbox.
- **Resize it with the tokens above.** The thumb travel adjusts by itself. Do not set the width or height directly.
