# Fix round 1 — agent D (Forms)

Implemented in the shared checkout, without commits. Only D-owned runtime files, forms docs, a new shared reset helper, D tests and requested screenshots were edited. Gallery forms APIs remain compatible, so `gallery/sections/forms.tsx` needed no changes.

## Findings fixed

Regression names below are in `test/fix-d-forms.test.tsx` unless stated otherwise.

| Finding | Implementation | Regression test |
|---|---|---|
| #1 | `src/components/switch.tsx:43` resolves disabled once and prevents the Field spread from overwriting it. `src/components/input.tsx:29`, `textarea.tsx:25`, `checkbox.tsx:23`, `select.tsx:16` and other Field consumers inherit undefined/omitted disabled while explicit false wins. `docs/primitives/field.md` documents precedence. | `Switch: explicit disabled prop wins over Field`; equivalent named tests for Input, Textarea, Checkbox, Select trigger, NumberField, SearchField, PasswordField and Toggle; `all compound Field controls honor explicit disabled false and inherit omitted disabled`; `InputGroup explicit disabled and invalid props win over Field`. |
| #6 | `src/components/checkbox.tsx:32` restores one native input with ref, hidden, className and native props. Native checked/indeterminate setters, React updates, changes and resets synchronize data-state. `src/styles/forms.css:304` draws token-colored check/dash masks on the input itself. Wrapper/indicator markup and CSS removed. | `Checkbox retains one input, root props and native state`; `density geometry, native checkbox masks and stepper targets use tokens`; existing `supports select-all mixed state and native group submission` in `test/forms.test.tsx`. |
| #12 | `src/components/select.tsx:24` uses control-height/type tokens; `src/styles/forms.css:319` and `src/components/switch.tsx:9` use density-derived geometry and track-width/height, padding, thumb-size/travel component tokens. Thumb travel derives from resized geometry. | `density geometry, native checkbox masks and stepper targets use tokens`. |
| #16 | `src/components/field.tsx:47` registers Label IDs; `field.tsx:91` exposes label, description, invalid and required ARIA. Compound roots/parts receive them, with consumer overrides. `src/components/slider.tsx:50` also forwards root ARIA through context to composed SliderThumb children. RadioGroup/CheckboxGroup/ToggleGroup/ColorPicker/Calendar use group or focusable-part wiring. | `compound controls inherit Field names, description and invalid state`; `Slider forwards explicit naming and state overrides to its thumbs`; `composed SliderThumb inherits root naming and ARIA`; `ColorPicker names editable parts with the Field label`. |
| #17 | `src/components/otp-field.tsx:144` names the group from Field or explicit aria-label; `otp-field.tsx:188` combines Field label ID with hidden digit-position text for each cell, or uses explicit label plus position. | `OTP names group and cells from Field or explicit aria-label`. |
| #18 | `src/components/number-field.tsx:141` derives valuenow/valuetext from valid drafts, removes valuenow for empty/invalid drafts and supplies descriptive valuetext. | `NumberField ARIA follows valid, empty and invalid drafts`. |
| #29 | `src/components/number-field.tsx:78` reconciles local controlled drafts on parent reassertion, including the same numeric value. Commit/stepping render the controlled number when a requested change is rejected. | `NumberField restores controlled value after rejection and reassertion`. |
| #33 | `src/components/number-field.tsx:57` detects separators using a decimal formatter with guaranteed fractional output, independent of percent/currency formatting. | `NumberField parses de-DE 25,5% correctly`; matching negative percent, fr-FR narrow-NBSP grouping, en-US grouping and empty tests. |
| #34 | `src/lib/use-form-reset.ts:4` observes native reset, including external association and cancelled resets. Its resettable state restores mount-time uncontrolled defaults silently. Integrated with NumberField, SearchField, OTPField, Toggle, Switch, CheckboxGroup, ToggleGroup, ColorPicker, ColorSwatchGroup, Slider, RadioGroup, Calendar and PasswordField reveal state. Checkbox keeps native reset and refreshes state hooks. | `native reset restores custom uncontrolled controls (ancestor form)`; matching external-form test; `cancelled reset and controlled values remain authoritative`; `Calendar and PasswordField reset their initial uncontrolled state`. |
| #35 | `src/components/search-field.tsx:56` resolves inherited/explicit disabled; `search-field.tsx:83` blocks clear button and Escape when disabled/readOnly. | `SearchField clear and Escape respect readOnly`; matching inherited-disabled and explicit-disabled tests. |
| #36 | `src/components/calendar.tsx:94` selects an outside-month day and displays that month. `calendar.tsx:272` and `:292` navigate headers relative to displayed month. Decision documented in `docs/primitives/calendar.md`. | `Calendar outside-day selection changes month and header navigation advances one month`. |
| #43 | `src/components/color-picker.tsx:40` keeps complete editable HSV state; updates retain saturation at V=0 and hue at S=0. External hex changes reconcile the coordinates. | `ColorPicker preserves editable HSV at black and gray and accepts external hex changes`. |
| #44 | `src/components/otp-field.tsx:31` tracks composition per cell; changes/navigation wait for compositionend. | `OTP ignores IME input and navigation until composition ends`. |
| #45 | Explicit root-composition exceptions and supported headless alternatives added to `docs/primitives/number-field.md:19`, `otp-field.md`, `calendar.md` and `color-picker.md`. Their generated multiple children cannot be passed as a single Slot child; useNumberField/useOTPField/useCalendar/useColorPicker support custom roots and parts. | `documented composition exceptions provide headless alternatives`. |
| #57 (steppers) | `src/styles/forms.css:332` gives each stepper a 24×24 token-based pseudo-element target without changing visible geometry. Upper/lower targets extend outward from their shared edge. Root/button overflow permits the extra hit area. | `density geometry, native checkbox masks and stepper targets use tokens`; browser computed-style verification: both targets 24px × 24px, root overflow visible, compact root height 28px. |
| #58 (NumberField root) | `src/components/number-field.tsx:173` adds rootRef, inputRef and inputProps. Root receives className/style/rootRef; editable input receives inputProps/inputRef. Legacy forwarded input ref and remaining top-level native input props still work; migration/deprecation note in `docs/primitives/number-field.md:21`. Consumer input handlers compose with internal behavior. | `NumberField routes style, className and rootRef to root and inputRef/inputProps to input`. |
| #59 (forms) | `src/components/number-field.tsx:232` treats string false as valid. `radio-group.tsx:33` and `slider.tsx:61` emit data-invalid; Switch/Checkbox keep state/disabled/invalid hooks. Forms docs describe actual behavior and FileTrigger no longer advertises unused button-padding-x. Forms CSS supplies component fallbacks after the concurrent removal of global component-default declarations. | NumberField root-channel test includes aria-invalid="false"; `RadioGroup and Slider expose invalid state hooks`; invalid/disabled override and compound naming tests. |

## Not fixed

None of D's assigned findings remain unresolved. #45 uses the explicitly permitted documented-exception route, rather than introducing incompatible root Slot semantics. Findings owned by other agents were left to those agents.

## Shared-file requests

- **Registry owner B/orchestrator:** include `src/lib/use-form-reset.ts` in dependency closure for forms using it. It exports `useFormReset` and internal `useResettableState`; no public barrel/package export is needed. Re-run registry sync after concurrent work settles.
- Runtime dependency changes also include Field context and composed-ref imports in forms such as PasswordField, Toggle, ToggleGroup, RadioGroup, Slider, ColorPicker, Calendar and ColorSwatchGroup. Registry sync must collect those transitive dependencies.
- Switch component tokens are already present in A's concurrently expanded `src/theme/tokens.ts`; no additional token-file edit is requested. The checkbox mask variable uses the private `--_onyx-checkbox-mask` name.
- No edits were made to registry.json, package.json, src/index.ts, shared existing hooks or A-owned globals/tokens.

## Verification

- `bun run typecheck`: **passes**.
- `bun test test/forms.test.tsx test/fix-d-forms.test.tsx`: **54 pass, 0 fail** (16 existing, 38 new).
- Full `bun test`: **269 pass, 2 fail** across 28 files. Both failures are expected registry staleness in `src/registry.test.ts`: dependency metadata and complete import closure. The new PasswordField reset-helper/Field imports are among the un-synced entries. All non-registry tests pass, including A's expanded token-contract checks.
- `bun run build:css`: **passes**.
- Gallery at `http://localhost:4816` inspected in the T3 collaborative browser. Checkbox check and indeterminate dash visually match the mockup's compact filled blue input treatment. NumberField retains its visible stepper geometry with enlarged computed hit targets. Forms layout still renders all eight cells. The in-progress overlay work leaves the DatePicker portal partially visible at the top edge in these captures; that positioning belongs to C, not D.

## Screenshots

- `gallery/screenshots/fix-d-dark-compact.png` — 1280px wide, dark/compact forms, indeterminate checkbox.
- `gallery/screenshots/fix-d-dark-compact-checked.png` — 1280px wide, dark/compact forms after selecting all locales, checked checkbox.
- `gallery/screenshots/fix-d-light-comfortable.png` — 1280px wide, light/comfortable forms, indeterminate checkbox.

Visible forms changes: single-input masked checkbox indicators; density-aware Switch/Select geometry; NumberField minimum hit areas; fallback control height/radius after the token-cascade work. Existing gallery API usages remain valid.
