# Review round 1: consolidated findings

There were seven parallel read-only reviewers (GPT‑6.1‑Sol, medium effort): foundations, overlays, forms, collections, display, accessibility, and theming/API. Their 67 raw findings reduce to 59 once duplicates are merged. No blockers were found. Typecheck passes, and all 120 tests pass.

C = confirmed with a scratch test or browser probe. R = reasoned from the code.

## Tier 1: breaks existing consumers or installs

| # | Finding | Where | Conf |
|---|---|---|---|
| 1 | `<Switch disabled />` renders enabled: the props spread overwrites the resolved `disabled`. Inside a disabled Field, `disabled={false}` stays disabled. | switch.tsx:72 | C |
| 2 | `SidebarRail` throws without a `SidebarProvider`; before, it worked standalone. Babel exposes it to bricks through shared exports. | sidebar.tsx:484 | C |
| 3 | The registry sync skips type-only imports, so `progress` and `empty-state` install without `badge.tsx`. | scripts/sync-registry.ts:81 | C |
| 4 | The registry sync ignores CSS imports, so `@vscode/codicons` is no longer declared by any item. | scripts/sync-registry.ts:74 | C |
| 5 | The new `hooks` registry item breaks Bedrock's generated barrel: it expects `./components/hooks`. | registry.json | C |
| 6 | The Checkbox wrapper span moves `hidden` and layout classes onto the inner input. | checkbox.tsx:25 | R |

## Tier 2: the theming promise ("full control afterwards") is not yet true

| # | Finding | Where | Conf |
|---|---|---|---|
| 7 | Every `[data-theme]`/`[data-density]`/theme root redeclares component tokens, so an outer `--onyx-button-radius` override resets inside a nested boundary. | globals.css:335 | C (browser) |
| 8 | Semantic aliases resolve where they are declared. Palette or semantic overrides through `variables` without an explicit `theme` don't rebind derived tokens. | globals.css:62,157; theme.tsx:40 | C (browser) |
| 9 | Tailwind variant rules (`checked:`, `data-[state=…]:`, animation variants) are emitted outside the cascade layers, so they beat consumer CSS. | globals.css:12 | C (CSSOM) |
| 10 | `OnyxThemeVariables` omits many component tokens CSS actually reads (card-bg, badge-height, slider-thumb-size…). | tokens.ts:539 | C |
| 11 | Stack/Inline/Container/Grid write default variables inline, so ancestor token overrides do nothing. | layout.tsx:55 | C |
| 12 | Select, Switch, Text/Heading, Table and TabBadge still use fixed px or Tailwind type sizes and ignore density and type tokens. | select.tsx:23, switch.tsx:7, text.tsx:31, tabs.tsx:286 | C |
| 13 | Custom keyframes live only in Onyx's Tailwind config, so registry consumers lack skeleton, pulse, indeterminate and accordion animations. | tailwind.config.cjs | R |

## Tier 3: accessibility (major)

| # | Finding | Where | Conf |
|---|---|---|---|
| 14 | **Contrast (needs a design decision):** primary-button hover is 3.83:1; solid success is 4.39; subtle badges fail (light warning 3.01, light success 3.81, light neutral 4.47, dark danger 4.09, dark info 4.47); description text on light panel is 4.47 and on dark raised is 4.04. | tokens.ts | C |
| 15 | Input border contrast is 1.62 (dark) / 1.39 (light), below the 3:1 non-text minimum. | globals.css:85,211 | C |
| 16 | The Field label, description and invalid state never reach the Slider thumbs or the RadioGroup, so they are unnamed. | field.tsx:115, slider.tsx:52/73, radio-group.tsx:24 | C |
| 17 | OTP: the per-cell "Digit 1 of 6" label overrides the visible Field label, and the group is unnamed. | otp-field.tsx:57,149 | C |
| 18 | NumberField's `aria-valuenow` is stale while the user types. | number-field.tsx:132 | C |
| 19 | Roving focus strands keyboard users inside a text input in a toolbar. | use-roving-focus.ts:44,87 | C |
| 20 | Roving focus counts hidden inputs as items, which can take the only tab stop. | use-roving-focus.ts:29 | C |
| 21 | Tree drag-and-drop has no keyboard or single-pointer alternative. | tree.tsx:249 | R |
| 22 | Toasts lose focus when the focused toast is dismissed or displaced. | toast.tsx:373 | C |
| 23 | Tag removal through the button (and removing the last tag) loses focus. | tag.tsx:54,83 | C |
| 24 | SectionSelect and CommandInput remove focus indicators without a replacement (both pre-date this work). | section-select.tsx:377, command.tsx:55 | C |

## Tier 4: behaviour bugs (major)

| # | Finding | Where | Conf |
|---|---|---|---|
| 25 | The Combobox list can't be clicked inside a modal Sheet/Dialog (body pointer-events). | combobox.tsx:515 | C/R |
| 26 | Pop-ups opened inside a Sheet/Dialog render beneath it (z-popover < z-dialog). | overlays.css:3 | R |
| 27 | A single-date DatePicker submits the typed draft, not the committed date. | date-picker.tsx:170 | C |
| 28 | A controlled DatePicker shows a selection the parent rejected. | date-picker.tsx:79 | C |
| 29 | A controlled NumberField shows a value the parent rejected. | number-field.tsx:84 | C |
| 30 | A controlled Carousel scrolls to an index the parent rejected. | carousel.tsx:54 | C |
| 31 | The Combobox selected label doesn't sync when options load or change. | combobox.tsx:86 | C |
| 32 | The Combobox active option moves to whatever value is now at the same index after options change, so Enter selects the wrong item. | combobox.tsx:112 | C |
| 33 | NumberField de-DE percent: `25,5%` gives 2.55 instead of 0.255. | number-field.tsx:55 | C |
| 34 | Native form reset is ignored by NumberField, Toggle, SearchField, OTP, CheckboxGroup, ToggleGroup, ColorPicker and ColorSwatchGroup. | number-field.tsx:47, toggle.tsx:37 … | C/R |
| 35 | SearchField clear (button and Escape) bypasses read-only and an inherited disabled state. | search-field.tsx:78,105 | C |
| 36 | Calendar "next month" jumps two months after clicking an outside-month day. | calendar.tsx:281 | C |
| 37 | Listbox/Tree keyboard range selection uses a stale anchor (End, Shift+Up selects 1–4). | listbox.tsx:159 | C |
| 38 | A custom `rowHeight` moves virtual offsets but not row CSS height, so rows overlap or leave gaps. | tree.tsx:522, listbox.tsx:326 | R |
| 39 | Tabs can end up with two tab stops (React and the roving hook both own tabIndex). | tabs.tsx:193 | C |
| 40 | Listbox `getItemProps` is O(n²): 77M `getKey` calls for 12,480 rows. | listbox.tsx:185 | C |

## Tier 5: minor

41. DatePicker range hidden inputs ignore `form=` (date-picker.tsx:253).
42. Constrained Popover and NavigationMenu content overflows instead of scrolling (overlays.css:39,341).
43. ColorPicker loses saturation at zero brightness, so red becomes white (color-picker.tsx:38).
44. OTP advances focus during IME composition (otp-field.tsx:60).
45. Missing `asChild` or part APIs: NumberField, OTP, Calendar, ColorPicker, DialogHeader/Footer, Text/Heading, and generated parts (forms #11, theming #8).
46. Roving focus doesn't refresh on dynamic `inert` (use-roving-focus.ts:59).
47. A `loading` Button with `asChild` still runs the child's capture handler (button.tsx:137).
48. `useFloatingPosition` leaves a stale width after `matchWidth` turns off (use-floating-position.ts:40).
49. Toast announcements follow the queue position, not events; repeats are silent and there are duplicate announcers (toast.tsx:386).
50. A toast queue mounted in a hidden tab starts unpaused (toast.tsx:236).
51. Count: an unchecked `max` gives "-1+", and the aria-label doesn't match the normalized value (badge.tsx:55).
52. Avatar initials split graphemes: "🇧🇪 User" gives "🇧U" (avatar.tsx:21).
53. Toast durations above 2³¹ ms expire immediately (toast.tsx:295).
54. `SplitView` `autoSaveId` touches `localStorage` outside its try block (split-view.tsx:191).
55. Typeahead skips the current item when the prefix is extended (listbox.tsx:149).
56. Pagination doesn't normalize fractional or NaN pages (pagination.tsx:78).
57. Compact target sizes: carousel dots 6px, NumberField steppers ~18×13, `icon-xs` 20px (WCAG 2.5.8).
58. Some `*Variants` functions (Badge, Avatar) depend on data attributes, so they're unusable alone. Composite roots split className, style and ref (NumberField, Combobox, DatePicker).
59. Docs drift and state-attribute inconsistencies: FileTrigger's unused token, Count's ignored `variant`, NumberField treating `aria-invalid="false"` as invalid, missing `data-invalid` on RadioGroup/Slider, Tabs/Switch without hooks.

## Recurring patterns (fix once, apply everywhere)

- **Controlled components keep optimistic internal state** (#28–30, #18): they need one reconciliation rule.
- **Form participation** (#27, #34, #41): they need a shared `useFormReset` helper plus a hidden-input pattern for committed values.
- **Focus after removal** (#22, #23): they need a shared "restore to neighbour or fallback" helper.
- **Field context only reaches single-element controls** (#16, #17): compound controls need a label ID plus per-part wiring.
- **The token cascade** (#7–#11): redeclaring tokens per boundary has to be replaced with fallbacks resolved at the point of use.

## Decisions for the design owner

- **Contrast token adjustments** (#14, #15): these shift the look.
- **Checkbox wrapper** (#6): keep it with root props and migration notes, or draw the indicators without a wrapper.
- **Tree drag-and-drop** (#21): ship keyboard move commands, or document that consumers must provide an alternative.
- **Compact targets** (#57): enlarge the hit areas while keeping the visible size.
