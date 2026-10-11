# Fix round 1: coordination

Source of findings: `docs/primitives/reports/review-r1.md`. Finding numbers below (#n) refer to that file.
Repo: `/Users/stellar/Playground/onyx`, branch `feat/primitives-expansion`. Nothing is committed yet.

## Decisions (made by the design owner)

1. **Contrast (#14, #15):**
   - Fix every failing pair to at least 4.5:1 for text and at least 3:1 for UI boundaries, in both themes.
   - Keep the Flexoki character: prefer moving to an adjacent palette step over inventing new colours.
   - Button hover must also pass.
2. **Checkbox (#6):**
   - No wrapper. Restore the HEAD DOM shape: a single `<input>` that receives ref, className and every prop.
   - Draw the check and the indeterminate dash on the input itself, using CSS `background-image` (inline SVG data URI using `currentColor`-equivalent token colours via CSS mask, or similar).
   - Also expose `data-state="checked|unchecked|indeterminate"` on standalone Checkbox.
3. **Tree drag-and-drop (#21):**
   - Add keyboard move commands, e.g. a `moveItem` API plus a documented key binding such as Ctrl/⌘+Shift+Arrow, or "cut/paste"-style marking.
   - Add an `onMoveItem` callback that shares the drop-position vocabulary (`before | inside | after`).
   - Announce moves via a live region.
4. **Compact targets (#57):**
   - Enlarge hit areas to at least 24×24 using pseudo-element or padding hit areas.
   - Keep the visible geometry unchanged.

## Ownership (do not edit files you don't own)

| Agent | Owns | Findings |
|---|---|---|
| **A: Tokens & cascade** | `src/styles/globals.css`, `src/theme/tokens.ts`, `src/components/theme.tsx`, `tailwind.config.cjs`, `postcss.config.cjs`, `src/components/text.tsx`, `src/components/table.tsx`, `src/components/dialog.tsx`, `src/components/prompt.tsx`, `test/tokens.test.ts` (+ new `test/theming.test.ts`), `docs/primitives/README.md` (Theming section), `docs/primitives/theme.md` | #7 #8 #9 #10 #12 (text/table/dialog/prompt) #13 #14 #15 |
| **B: Registry, compat & shared libs** | `scripts/sync-registry.ts`, `registry.json`, `package.json`, `src/index.ts`, `src/hooks.ts` + any new compat shim, `src/components/sidebar.tsx`, `src/lib/use-roving-focus.ts`, `src/lib/use-floating-position.ts`, `src/components/button.tsx`, `src/components/toolbar.tsx`, `src/components/section-select.tsx`, `src/components/command.tsx`, `src/registry.test.ts` | #2 #3 #4 #5 #19 #20 #24 #46 #47 #48, #57 (`icon-xs` hit area) |
| **C: Overlays** | `src/components/{combobox,date-picker,popover,navigation-menu,menu,sheet,alert-dialog,tooltip,hover-card,menubar,truncate}.tsx`, `src/lib/menu-styles.ts`, `src/styles/overlays.css`, overlay tests, overlay docs, `gallery/sections/overlays.tsx` | #25 #26 #27 #28 #31 #32 #41 #42 |
| **D: Forms** | `src/components/{field,input-group,search-field,number-field,radio-group,checkbox-group,slider,toggle,toggle-group,otp-field,password-field,color-swatch,color-picker,calendar,file-trigger,drop-zone,checkbox,switch,select,input,textarea}.tsx`, `src/lib/color.ts`, `src/styles/forms.css`, `test/forms.test.tsx` (+ new tests), forms docs, `gallery/sections/forms.tsx` | #1 #6 #12 (select/switch) #16 #17 #18 #29 #33 #34 #35 #36 #43 #44 #45 (forms parts) #57 (number-field steppers) #59 (forms parts) |
| **E: Collections** | `src/components/{listbox,tree,virtual-list,scroll-area,resize-handle,split-view,collapsible,accordion,pagination,carousel,tabs,panel}.tsx`, `src/styles/collections.css`, collection tests, collection docs, `gallery/sections/collections.tsx` | #21 #30 #37 #38 #39 #40 #54 #55 #56, #57 (carousel dots), #12 (TabBadge) |
| **F: Display & layout** | `src/components/{toast,tag,badge,avatar,layout,alert,card,skeleton,meter,progress,separator,link,breadcrumb,empty-state}.tsx`, `src/styles/display.css`, display tests, display docs, `gallery/sections/display.tsx` | #11 #22 #23 #49 #50 #51 #52 #53 #58 (Badge/Avatar variants) #59 (Count variant) |

Item #45 for non-forms parts (DialogHeader/Footer, Text/Heading `asChild`) belongs to A. Composite-root prop consistency (#58: NumberField → D; Combobox/DatePicker → C) belongs to the owning agent.

## Shared rules

- **Shared files.** `registry.json`, `package.json` and `src/index.ts` are B-only.
  - If you add a runtime import or a new export, list it under **"Shared-file requests"** in your report.
  - `src/registry.test.ts` may go stale while agents work in parallel. That failure alone is expected; the orchestrator re-runs `bun run registry:sync` at the end. Every other test must stay green.
- **Tests.** Every fixed finding gets a regression test that fails before your fix and passes after. Add tests in your own test files; new files go under `test/fix-<agent>-*.test.tsx`.
- **Token discipline.** Raw hex or px is allowed only for 1px hairlines. Keep `data-slot` hooks, ref forwarding, className merge and `asChild` where they exist.
- **Don't regress existing public APIs.** Compare with `git show HEAD:<file>` for files that existed before this branch.
- **Verification.** Run `bun run typecheck` and `bun test`. The gallery runs at http://localhost:4816; if it's down, start it with `bun gallery/server.ts`. A headless shell for screenshots is at `~/Library/Caches/ms-playwright/chromium_headless_shell-1243/*/chrome-headless-shell`.
- **No commits.** Never revert, reformat or rewrite files owned by another agent.
- **Final report must contain:**
  - The finding numbers you fixed, with a file:line and a test name for each.
  - Findings you couldn't fix, and why.
  - Shared-file requests.
  - Typecheck and test results.
  - Any visual change, with screenshot paths.
