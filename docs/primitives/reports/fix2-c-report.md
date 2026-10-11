# Fix round 2 — C: Overlays

Implemented R10–R12 in the shared checkout on `feat/primitives-expansion`. No commits. Only C-owned sources, overlay docs/tests and gallery section were edited; Dialog is explicitly assigned to C this round. `gallery/onyx.css` was regenerated for browser verification.

| Item | Implementation | Regression test |
|---|---|---|
| R10 | `src/components/combobox.tsx:177` renders the accepted controlled option label after selection. `:94` exposes draft reconciliation; `:364` reconciles every parent reassertion, including an unchanged value, while local typing keeps its draft. Explicit controlled inputValue remains authoritative. | `test/fix2-c-overlays.test.tsx:9`: **R10 controlled Combobox restores the accepted label after rejected pointer and keyboard selections**; `:22`: **R10 controlled Combobox reconciles a draft when the parent reasserts the same value**; `:50`: **R10 headless controlled Combobox keeps a local typing draft and rejects an unaccepted selection label**. |
| R11 | `src/components/dialog.tsx:48` captures the actual content host through composed refs and `:51` supplies PortalContainerProvider. Public props, slots, forwarded refs, content asChild and Header/Footer asChild are preserved. `gallery/sections/overlays.tsx:304` adds a nested Dialog demo with Combobox, DatePicker and a constrained Popover. Overlay nesting docs now include automatic Dialog hosting. | `test/fix2-c-overlays.test.tsx:29`: **R11 Dialog hosts nested portals and preserves content refs and asChild structural parts**. Actual Chromium gallery pointer clicks/hit tests also verified (below). |
| R12 | `src/styles/overlays.css:599` makes the outer Popover a flex column with a shrinkable `min-height: 0` inner scroller. `src/components/popover.tsx:79` no longer duplicates the outer maxHeight onto the inner scroller. Direct arrow stays outside. Replaced the CSS-text scrolling test in `test/fix-c-overlays.test.tsx` with computed Chromium geometry. `docs/primitives/navigation-menu.md:17` accurately describes the root navigation DOM slot. | `test/fix2-c-browser.test.tsx:27`: **R12 CSS-class constrained Popover subtracts padding, scrolls internally and keeps its arrow outside; NavigationMenu scrolls**. It resolves ONYX_CHROMIUM or installed Playwright headless shells, and fails in CI if absent. |

## Before/after evidence

The first R10 selection and unchanged-parent-value tests failed on the original source (Beta/draft instead of Alpha). The R11 test failed because the listbox was outside the Dialog host. Both pass after the fix. The new R12 browser test was also run against the old layout rules: inner bottom was 589 while content bottom allowance was 108; it failed. Restoring the flex/scroller rules passes.

Updated round-1 controlled-query expectation to follow this round's controlled-value rule: a parent reassertion restores Alpha, while an uncontrolled query survives options refresh. Removed the obsolete copied-inner-maxHeight assertion.

## Chromium verification and screenshots

Gallery reused at `http://localhost:4816/?section=overlays&theme=dark&density=compact`, viewport 1280 × 800. Product-native browser reports Chrome/154; the computed-geometry regression separately executes the installed Playwright Chromium headless shell.

- `gallery/screenshots/fix2-c-combobox-dialog.png`: French and English options are inside DialogContent; both elementFromPoint hit tests pass. Actual pointer click on English changes the input to English.
- `gallery/screenshots/fix2-c-date-picker-dialog.png`: Previous month and Next month both pass elementFromPoint hit tests. Actual clicks navigate October → November → October. Screenshot shows November 2026 above the Dialog.
- `gallery/screenshots/fix2-c-popover-scroll-dialog.png`: CSS-class limit is 120px; outer height is 120px with 12px padding, inner clientHeight 94, scrollHeight 390, scrollTop 100. Inner bottom equals content bottom (596), and arrow is outside the scroller.

Screenshots were saved, copied to the requested gallery paths and visually inspected. Native preview remained available; no browser fallback was necessary.

## Verification

- Final `bun run typecheck`: **pass** (`/tmp/onyx-fix2-c-typecheck-final.log`).
- Final `bun test`: **311 pass, 0 fail**, 35253 assertions across 37 files (`/tmp/onyx-fix2-c-suite-final.log`).
- Focused overlay suite: **27 pass, 0 fail**, 133 assertions across four files (`/tmp/onyx-fix2-c-focused.log`).
- `bun run build:css`: **pass**.
- Scoped `git diff --check`: **pass**.

An earlier concurrent full-suite snapshot had two expected registry-staleness failures and D's NumberField browser hit-area failure (557/576 pixels). An earlier typecheck snapshot had E's Tree DragEvent cast and ByRoleOptions errors. Final verification passes after concurrent agent fixes; no other agent's files were edited to address those failures.

## Shared-file requests / remaining work

- B: Dialog now imports `./popover` and `../lib/compose-refs`; preserve those registry dependency closures during final sync. No package or index change is required. The final suite's registry checks already pass.
- No R10–R12 item remains undone. No additional shared-file changes are requested.
