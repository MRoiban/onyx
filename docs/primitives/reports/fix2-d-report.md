# Fix round 2 — agent D (Forms)

R1–R9 implemented in the shared checkout. No commits; no edits to other agents' runtime files or B-owned shared files.

## Items and regressions

Forms tests are in `test/fix2-d-forms.test.tsx`; browser tests are in `test/fix2-d-browser.test.tsx`.

| Item | File:line and resulting behavior | Test name |
|---|---|---|
| R1 | `src/components/checkbox.tsx:26` uses React state, layout effects, reset observation and change handlers for data-state. No input property descriptors are overridden. Mixed ARIA state sets/clears indeterminate through the input ref. Controlled rejected clicks keep the accepted checked/data-state. | `R1 repeated rejected controlled Checkbox clicks retain React tracking`; `R1 Checkbox effects synchronize mixed state without native descriptor overrides` |
| R2 | `src/styles/forms.css:304`, `:319`; `src/components/checkbox.tsx:9` moves appearance out of the utility class so the forced-colors media rule can apply native appearance and suppress the masked pseudo-element. Native checked, mixed and empty indicators remain distinct. | `R2 forced colors use native distinct checked, mixed and unchecked indicators` |
| R3 | `src/styles/forms.css:334` groups both arithmetic fallbacks with calc. Checked thumb travel is 14px compact / 18px comfortable, with 2px right padding in both. | `R3 Switch aligns checked thumbs and R6 steppers retain all 24 by 24 hit pixels` |
| R4 | `src/components/slider.tsx:39`, `:83` adds per-thumb hidden labels and composes their IDs with the inherited Field label. Range names are Budget Minimum and Budget Maximum. | `R4 range thumbs compose Field and per-thumb names` |
| R5 | `src/components/otp-field.tsx:169`, `:181` gives the group a distinct generated ID and the first input the Field/explicit control ID. label.control identifies that input uniquely. | `R5 OTP Field label uniquely targets its first cell` |
| R6 | `src/styles/forms.css:337`, `:346` contains stepper icon dimensions, disables icon pointer events, and insets the upper extended target from the shared 1px border. Each 24×24 target receives all 576 sampled pixels without a sibling icon taking hits. | `R3 Switch aligns checked thumbs and R6 steppers retain all 24 by 24 hit pixels` |
| R7 | `src/components/color-picker.tsx:42` reconciles editable HSV against the accepted color every render, including same-value rejection. Equivalent HSV representations retain latent hue/saturation at black and hue at gray. | `R7 controlled ColorPicker rejects HSV changes and preserves equivalent latent coordinates` |
| R8 | `src/lib/use-form-reset.ts:2`, `:33` imports and wraps useControllableState; reset silently uses its setter to restore the mount-time uncontrolled default. No duplicated controlled state implementation and no changes to B's hook. | `R8 resettable state resets silently and retains functional updates and controlled authority` |
| R9 | Removed the docs-text test from `test/fix-d-forms.test.tsx`. Real custom section roots and custom controls now exercise all four hooks in `test/fix2-d-forms.test.tsx:84`. | `R9 useNumberField supports typing and stepping in a custom root`; `R9 useOTPField supports paste, focus navigation and deletion in a custom root`; `R9 useCalendar supports keyboard selection in a custom root`; `R9 useColorPicker supports custom root interaction` |

The prior native Checkbox test now synchronizes imperative property changes on React re-render, rather than asserting interception of arbitrary native setters.

## Verification

- `bun run typecheck`: passes on final run. An earlier run briefly saw an in-progress E-owned Tree type error; it was resolved by concurrent work before final verification.
- `bun test`: **311 pass, 0 fail**, across 37 files. Registry checks also passed on this run; no staleness failure to disregard.
- `bun run build:css`: passes.
- New D tests: 10 interaction tests plus 2 real Chromium tests, all passed in the full suite.
- Chromium shell resolves `ONYX_CHROMIUM` first, then installed `chromium_headless_shell-*`; missing Chromium fails in CI rather than silently skipping.
- Forced-colors verification used the installed Chromium headless shell with `--force-high-contrast`. Computed appearance is auto; masked pseudo-element display is none. Screenshot visually inspected: check, dash and empty outline are distinguishable in both densities.
- Gallery `http://localhost:4816` verified in real Chromium using its live CSS. The gallery has no Switch example, so a temporary Switch track/thumb probe was inserted, measured and removed. Compact: track 31.5px, thumb 13.5px, travel 14px, right gap 2px. Comfortable: track 40.5px, thumb 18.5px, travel 18px, right gap 2px.
- The live gallery NumberField's increment/decrement targets each received **576/576** sampled hit pixels in both densities; both icons computed pointer-events none. Browser regression fixtures separately render the actual Switch and NumberField components and assert the same geometry.

## Screenshots

- `gallery/screenshots/fix2-d-checkbox-forced.png` — native forced-colors checked / indeterminate / unchecked controls in compact and comfortable density; also shows checked Switch and NumberField geometry.

## Shared-file requests

- B/orchestrator: ensure registry dependency closure includes the new `src/lib/use-form-reset.ts` → `src/lib/use-controllable-state.ts` runtime import. No new public export or package dependency is required. Current registry tests passed, so the concurrent registry synchronization may already include it.

## Not done

None. All assigned items R1–R9 are implemented and verified.
