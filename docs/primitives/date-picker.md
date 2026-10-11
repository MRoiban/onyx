# Date Picker

Use when: single date or date-range selection with a calendar popup. Not for: time-of-day input or custom date arithmetic.

## Public API

`datePickerVariants`, `UseDatePickerOptions`, `useDatePicker`, `DatePickerProps`, `DatePicker`.

## Anatomy

`calendar-day`, `date-picker`, `date-picker-content`, `date-picker-control`, `date-picker-form-end`, `date-picker-form-start`, `date-picker-input`, `date-picker-label`, `date-picker-trigger`.

## Props and state

Calendar mode/value/defaultValue/onValueChange/min/max/locale/weekStartsOn/disabled/defaultMonth; open/defaultOpen/onOpenChange; label/name/inputProps/calendarProps/contentProps. Single input edits YYYY-MM-DD; ranges are read-only and selected in Calendar. Invalid typed dates keep the previous committed value. Range form names are name and name.to.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`, `--onyx-input-height`, `--onyx-input-radius`, `--onyx-control-input-bg`, `Tag/Input/Button/Calendar tokens for composed primitives`.

## Headless behavior

useDatePicker(options) returns value/open/setOpen/draft/setDraft/invalid/select/commit/mode. Calendar owns all date math, range validation and grid navigation; a completed selection closes the popup.

## Example

```tsx
<DatePicker
  mode="range"
  label="Review window"
  name="reviewWindow"
  defaultMonth={new Date(2026, 9, 1)}
  onValueChange={setRange}
/>
```

The root exposes `data-state="open|closed"` and `data-invalid`. `Alt+ArrowDown` opens the popup from the input. The popup initially focuses the Calendar's current tabbable day, and a completed selection returns focus through Radix's normal restoration behavior. No separate calendar implementation is included.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.

## Root and input customization

`className`, `style`, `rootProps` (div attributes/events) and `rootRef` target the composite root. Root classes/styles merge with `rootProps`; direct `className`/`style` take precedence. `inputProps` styles and attributes target the text input. The existing forwarded `ref` still points to that input for compatibility.

The visible draft input is unnamed. Hidden inputs submit committed local-date ISO values (`yyyy-mm-dd`), using `name` (or `inputProps.name`); ranges also submit `<name>.to`. Root `form` takes precedence over `inputProps.form` and associates both hidden fields with an external form. Invalid edits remain visible and expose `aria-invalid`/root `data-invalid`, while preserving the previous submitted value. Controlled selections/commits display the parent's controlled value when a change is rejected; a parent render reasserting its controlled value also reconciles in-progress drafts.
