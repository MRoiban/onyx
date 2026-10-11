# Calendar

Public API: Calendar, useCalendar, getWeekStartsOn; CalendarValue, DateRange, UseCalendarOptions, CalendarProps.

**Use when / Not for:** one date or an inclusive date range must be selected; not for time picking or scheduling views.

**Anatomy (data-slot):** calendar, calendar-header, calendar-previous/next, calendar-heading, calendar-grid, calendar-head/body, calendar-weekdays/weekday, calendar-week/cell/day, calendar-form-value/end.

**Props:** Stable API: mode="single"|"range", value/onValueChange/defaultValue, defaultMonth, min, max, locale, weekStartsOn, disabled boolean|predicate. Single value is Date; range is {from?:Date,to?:Date}. Uses local Gregorian dates and Intl labels; week start uses Intl.Locale week info. Only one day enters tab order; arrows move days/weeks, Home/End week edges, PageUp/Down months (Shift years), Enter/Space selects. Range clicks normalize reverse order, restart after completion, and reject crossing disabled dates. Unavailable dates remain focusable with aria-disabled; bounds clamp keyboard navigation. Month heading is polite live. name/form submits local ISO start and name.to end.

**Data attributes:** data-slot on every part; data-disabled and data-invalid where relevant. Radix controls expose data-state and data-orientation; native grouped checkboxes use checked/unchecked/indeterminate, Calendar uses selected/in-range/unselected, OTP cells filled/empty, swatches selected/unselected, DropZone idle/over/invalid plus data-drop-target.

**Tokens read:** --onyx-calendar-width/radius/day-height; menu-radius, surface-menu, border-default/strong, control-height-*, control-button-*, control-focus-ring, tone-info-bg, space-*, shadow-md. Component variables fall back to semantic tokens in forms.css. All rules live in onyx.components.

**Headless hook:** `useCalendar(options)` exposes value, month/setMonth, focusedDate/setFocusedDate, startOfWeek, dates, isDisabled/isSelected/isInRange, select, navigate, onKeyDown. Render all date rows (the mockup truncates the final week). Intl labels are explicitly Gregorian to match date arithmetic.

**Composition exception:** `calendar` generates multiple coordinated children, so its root does not support `asChild`. Use `useCalendar` to render a custom root and wire the returned state and handlers to your own parts; preserve the grouping roles, labels, keyboard behavior and form participation. The rendered component accepts root class/style and exposes `data-slot` hooks for each generated part.

Header previous/next buttons navigate relative to the displayed month. Selecting an outside-month day also changes the displayed month to that day’s month. Native reset restores the initial uncontrolled selection and displayed month.
