# Fix round 2: coordination

This round handles the remaining items from the round-2 verification. The original findings (#n) are in `review-r1.md`, and the round-1 rules are in `fix-r1.md`. All of round 1's shared rules still apply:
- Only edit files you own.
- Write a regression test that fails before your fix and passes after.
- Use tokens only.
- No commits.
- Only agent B edits `registry.json`, `package.json` and `src/index.ts`.
- New tests go in `test/fix2-<agent>-*.test.tsx`.

**Controlled-value rule:** a controlled component renders the value its parent passes in. Internal drafts exist only while the user is typing or dragging, and are reconciled every time the parent re-asserts its value, including when it rejects a change and the value doesn't change.

## Items

| ID | Agent | Item | Evidence |
|---|---|---|---|
| R1 | D | **Controlled Checkbox breaks:** the overridden `checked` descriptor bypasses React's value tracker. With `checked={false}` and a parent that rejects changes, the 2nd click fires no `onChange` and stays checked. | checkbox.tsx:38; repro `/tmp/onyx-r2-checkbox.tsx` |
| R2 | D | **Checkbox is invisible in forced colours:** check and dash vanish under `forced-colors: active`. Add an `@media (forced-colors: active)` treatment (e.g. `appearance: auto`, or system colours `CanvasText`/`Highlight` for the indicator). | forms.css:305; `/tmp/onyx-r2-checkbox-forced.png` |
| R3 | D | **Switch thumb travel is wrong:** an ungrouped arithmetic fallback inside a subtraction gives 6px instead of 14px (compact) and 10px instead of 18px (comfortable). Wrap fallbacks in `calc()`. Verify right-edge alignment in the browser. | forms.css:329 |
| R4 | D | **Range Slider ignores `thumbLabels`:** the inherited Field `aria-labelledby` overrides them, so both thumbs are named "Budget". Compose the Field label with a per-thumb label. | slider.tsx:83 |
| R5 | D | **OTP label doesn't focus anything:** the Field id is on both the group and the first input, so `label.control` is null. Give the first input the Field id and the group a distinct id. | otp-field.tsx:168,180 |
| R6 | D | **NumberField steppers overlap:** the decrement icon steals 42 of the increment button's 576 hit pixels. Contain the icon geometry and pointer-events. | forms.css:169,332 |
| R7 | D | **ColorPicker keeps a rejected value:** with a controlled red, a rejected `update({h:120})` leaves the HSV hue at 120. Reconcile to the accepted value while keeping latent saturation and hue for equivalent colours. | color-picker.tsx:43–51 |
| R8 | D | **`useResettableState` duplicates `useControllableState`:** build it on top of `useControllableState` by importing it, without editing B's file. | use-form-reset.ts:27 |
| R9 | D | **A test checks docs text, not behaviour:** replace the "headless alternatives" docs-text test with real custom-root interaction tests for `useNumberField`, `useOTPField`, `useCalendar` and `useColorPicker`. | fix-d-forms.test.tsx:97 |
| R10 | C | **Controlled Combobox shows a rejected label:** with a controlled Alpha, a rejected Beta selection displays "Beta". | combobox.tsx:173 |
| R11 | C | **`Dialog` doesn't provide the portal container:** Combobox options and DatePicker nav buttons sit beneath the Dialog and can't be clicked. **C takes ownership of `src/components/dialog.tsx` this round.** Keep its public API and data-slots. | #25/#26 partial |
| R12 | C | **Popover still overflows under CSS-class height limits:** padding isn't subtracted. Make the outer content a flex/grid container with a shrinkable inner scroller (`min-height: 0`), with the arrow outside it. Replace the CSS-text "scrolling" test with a computed-geometry test (happy-dom can't lay out, so use a Chromium test following `test/fix-a-browser.test.tsx`'s pattern, or a pure style assertion on the computed structure). Also fix the NavigationMenu docs: the root renders a DOM slot. | popover.tsx:79; fix-c-overlays.test.tsx:133 |
| R13 | E | **Tree keyboard moves bypass `canDrop`:** they must respect both `canDrop` and `canMove`. Also add a single-pointer alternative for moves (WCAG 2.5.7), e.g. pointer-activatable "Cut" / "Paste here" actions exposed through the headless API and rendered by the default Tree. Document it. | tree.tsx |
| R14 | B | **Adjacent `icon-xs` buttons overlap:** with a zero gap, their enlarged hit areas cover each other. Ensure enlarged targets never cover a sibling's visible box, e.g. clip the pseudo-element to half the gap, or reserve margin. Measure in the browser. | button.tsx:45 |
| R15 | B | **`use-removal-focus` picks bad targets:** it doesn't skip CSS-hidden controls or hidden inputs, and it returns after a `.focus()` that silently failed. **B takes ownership of `src/lib/use-removal-focus.ts`.** Share the eligibility check with `use-roving-focus` (export one `isFocusableCandidate`), and verify `document.activeElement` after each attempt before trying the next candidate or fallback. | use-removal-focus.ts:45 |
| R16 | F | **Variant functions ignore their options:** `badgeVariants` and `avatarVariants` return the same classes for every option. Make each `*Variants` produce the visual on its own (emit data-attribute-equivalent classes, or put the styles on classes), keeping the attribute helpers working. | badge.tsx:6, avatar.tsx:7 |
| R17 | F | **Toast queue tests use real timers:** 60–125ms waits. Switch to fake timers. | src/components/display.test.tsx:184 |
| R18 | A | **Browser tests skip silently:** they only run when one hard-coded Chromium revision exists. Resolve the browser via `ONYX_CHROMIUM` env, then any installed playwright `chromium_headless_shell-*`. When `CI` is set and no browser is found, fail instead of skipping. | test/fix-a-browser.test.tsx:11 |
| R19 | A | **Token and animation definitions are duplicated:** rebinding rules mirror the token maps by hand, and animations are defined in several places. Add a test that asserts the rebinding rules in globals.css match the token maps (or generate them), and keep one animation source. Overlay CSS currently has its own copies; if removing them needs overlays.css edits, list them as a request to C. | globals.css:805,1545 |
| R20 | A | **Docs drift:** remove or implement the unused `checkboxIndicator` token. Document the browser support for semantic rebinding in theme.md: `@scope` plus style queries need Chromium 118+, Firefox 146/151+ and Safari 18+ with caveats, and older browsers should pass an explicit `theme`. Make the README's headless-hook claim accurate (Switch has none; Tabs documents its model). | tokens.ts:384, theme.md, README.md |

Each agent's final report should list the item IDs with file:line, the test name, and typecheck/test results.
