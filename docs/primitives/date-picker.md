# Date Picker

A date field with a calendar button. In single mode you can type the date (`YYYY-MM-DD`) or pick it from the popup. Range mode is pick-only and shows the range localized ("6 – 10 Oct 2026").

**Use when:** a form needs a date or a date range in a compact field.
**Not for:** an always-visible calendar (use [Calendar](calendar.md)), time-of-day input, or relative dates such as "in 3 days" (build those as their own control).

## Import

```tsx
import { DatePicker, useDatePicker, formatRange } from '@onyx/ui/date-picker';
```

## Example

```tsx
<DatePicker label="Due date" value={due} onValueChange={(v) => setDue(v as Date | undefined)} min={new Date()} name="due" />

<DatePicker
  mode="range"
  label="Review window"
  name="reviewWindow"           // submits reviewWindow and reviewWindow.to
  defaultMonth={new Date(2026, 9, 1)}
  onValueChange={(v) => setRange(v as DateRange)}
/>
```

## API

Takes every [Calendar](calendar.md) option (`mode`, `value`, `defaultValue`, `onValueChange`, `min`, `max`, `locale`, `weekStartsOn`, `disabled`, `defaultMonth`), plus:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `label` | `string` | — | A visible label. Otherwise pass `inputProps={{ 'aria-label': … }}`. |
| `open` / `defaultOpen` / `onOpenChange` | `boolean` | `false` | |
| `name` | `string` | — | Hidden inputs submit committed ISO dates. Ranges add `<name>.to`. |
| `form` | `string` | — | Links the hidden inputs to an outside form. Takes precedence over `inputProps.form`. |
| `inputProps` | input attributes | — | Apply to the visible text input. That input has no `name` and is not submitted. |
| `calendarProps` | Calendar's non-state props | — | |
| `contentProps` | PopoverContent props | — | Including `container`; see [floating content in modals](README.md#floating-content-in-modals). |
| `className`, `style`, `rootProps`, `rootRef` | | | Apply to the root element. |
| `ref` | | | The text input. |

**`useDatePicker(options)`** returns `value`, `open`/`setOpen`, `draft`/`setDraft`, `invalid`, `select`, `commit` and `mode`. **`formatRange(value, locale?)`** formats a value the same way the field does.

Also exported: `datePickerVariants`.

## Behavior contract

**Onyx owns:** parsing typed dates, keeping invalid drafts visible (with `aria-invalid`) without losing the last valid value, the popup (focusing the current day on open and closing on a completed selection), form submission, and all date logic, through Calendar.

**You supply:** the value, the limits, and the label.

## Keyboard

| Key | Result |
|---|---|
| Alt+↓ (in the input) | Open the calendar |
| Calendar keys | See [Calendar](calendar.md#keyboard) |
| Escape | Close and return focus to the field |

## Anatomy

`date-picker` (`data-state="open|closed"`, `data-invalid`), `date-picker-label`, `date-picker-control`, `date-picker-input`, `date-picker-trigger`, `date-picker-content`, `date-picker-form-start`, `date-picker-form-end`, plus Calendar's slots.

## Tokens read

Input tokens (`--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-bg`), Popover and Calendar tokens.

## Gotchas

- **Typing works only in single mode.** In range mode the input is read-only, so ranges are picked in the calendar.
- **An invalid typed date doesn't change the value.** The previous valid date is kept, and still submitted, until the user enters a valid one.
- **Controlled values win.** If your parent rejects a change, the field shows the parent's value again.
