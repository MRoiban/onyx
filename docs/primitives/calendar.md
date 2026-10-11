# Calendar

A month grid for picking one date or a date range, shown inline. For a field with a popup calendar, use [Date Picker](date-picker.md).

**Use when:** the calendar should stay visible on the page or in a panel, such as a booking sidebar or a filter panel.
**Not for:** a compact form field (use [Date Picker](date-picker.md)), picking a time of day, or showing scheduled events (a scheduling view is app-specific).

## Import

```tsx
import { Calendar, useCalendar, getWeekStartsOn, type CalendarValue, type DateRange } from '@onyx/ui/calendar';
```

## Example

```tsx
<Calendar mode="single" value={date} onValueChange={(v) => setDate(v as Date | undefined)} />

<Calendar
  mode="range"
  value={range}
  onValueChange={(v) => setRange(v as DateRange)}
  min={new Date()}
  disabled={(d) => d.getDay() === 0}   // no Sundays
  locale="fr-FR"
  name="stay"                          // submits stay and stay.to
/>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `mode` | `'single' \| 'range'` | `'single'` | |
| `value` / `defaultValue` / `onValueChange` | `Date` (single) or `{ from?: Date; to?: Date }` (range) | — | `onValueChange` receives `CalendarValue`. Cast it to the type for your mode. |
| `defaultMonth` | `Date` | the value's month, otherwise today | The month shown first. |
| `min`, `max` | `Date` | — | Inclusive limits. The keyboard cannot move past them. |
| `disabled` | `boolean \| (date: Date) => boolean` | — | Disabled days stay focusable, with `aria-disabled`. |
| `locale` | `string` | `'en-US'` | Sets the month and weekday names, through Intl with the Gregorian calendar. |
| `weekStartsOn` | `0`–`6` | from the locale | `getWeekStartsOn(locale)` reports the locale's value. |
| `name`, `form` | `string` | — | Hidden inputs submit local ISO dates (`yyyy-mm-dd`). Ranges submit `name` and `name.to`. |
| `className`, `style`, `onKeyDown` | | | Apply to the root. `onKeyDown` applies to the day buttons. |

**`useCalendar(options)`** returns `value`, `month`/`setMonth`, `focusedDate`/`setFocusedDate`, `startOfWeek`, `dates`, `isDisabled`, `isSelected`, `isInRange`, `select`, `navigate` and `onKeyDown`. Use it to build a custom calendar, keeping the grid roles, labels and keyboard behavior.

## Behavior contract

**Onyx owns:** all date math (in local time), the grid and its ARIA, keyboard navigation, range rules, announcing the month heading, form submission, and restoring the default on form reset.

**You supply:** the value, the limits, and which dates are disabled.

## Keyboard

| Key | Result |
|---|---|
| ← / → | Previous / next day |
| ↑ / ↓ | Previous / next week |
| Home / End | Start / end of the week |
| PageUp / PageDown | Previous / next month (with Shift: year) |
| Enter / Space | Select |

## Range rules

- Clicking an earlier day after a later one swaps them into the right order.
- Clicking after a range is complete starts a new range.
- A range cannot span a disabled date.
- Selecting a day from a neighboring month switches to that month.

## Anatomy

`calendar`, `calendar-header`, `calendar-previous`, `calendar-next`, `calendar-heading` (a polite live region), `calendar-grid`, `calendar-head`, `calendar-weekdays`, `calendar-weekday`, `calendar-body`, `calendar-week`, `calendar-cell`, `calendar-day` (`data-state="selected|in-range|unselected"`, `data-disabled`), `calendar-form-value`, `calendar-form-end`.

## Tokens read

`--onyx-calendar-width`, `--onyx-calendar-radius`, `--onyx-calendar-day-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-border-{default,strong}`, `--onyx-control-height-*`, `--onyx-control-button-*`, `--onyx-control-focus-ring`, `--onyx-tone-info-bg`, `--onyx-space-*`, `--onyx-shadow-md`.

## Gotchas

- **No `asChild` on the root.** The calendar generates its own children. For a custom layout, use `useCalendar`.
- **Dates are local calendar days.** Times are ignored. Convert to UTC yourself before sending dates to a server, if your server needs UTC.
