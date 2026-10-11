# Fix A round 2: Tokens & cascade

No commits. A did not edit `dialog.tsx`, `overlays.css`, package/registry files, or other agents' source. The removed `onyxPostcss()` pass stays removed; inline source fallbacks remain the design. The optional preset remains animations-only and outside the registry.

## Item results

| Item | Files and behavior | Regression tests |
|---|---|---|
| R18 | `test/browser.ts:11`: shared `resolveChromium` prioritizes `ONYX_CHROMIUM`, then arbitrary Playwright headless-shell revisions under macOS and Linux home caches. An invalid explicit path throws; missing Chromium in CI throws an actionable installation/env message. Local absence permits skipping. `test/fix-a-browser.test.tsx:8` adopts the resolver. | `test/fix2-a-tokens.test.tsx:13`: “prefers ONYX_CHROMIUM and discovers arbitrary macOS and Linux revisions”; `:29`: “fails clearly in CI without Chromium and only permits local skipping”. The real-browser suite ran here without skips. |
| R19 | `src/styles/globals.css:1462`: removed repeated keyframes and bare animation classes throughout globals, retaining one definition per name. `tailwind.preset.cjs:1` mirrors the portable CSS and now includes the same spinner fallback. Semantic rebinding rules already exactly matched the current token maps; the new test guards all three scopes, query conditions, target selectors, declarations, omissions and extras. Overlay duplicate removal remains the shared-file request below. | `test/fix2-a-tokens.test.tsx:40`: “semantic rebinding scopes cover exactly each theme alias relationship”; `:56`: “globals defines each keyframe and animation class once and the preset mirrors them”. Existing browser “ships every animation with an independent consumer Tailwind config” passes. |
| R20 | `src/theme/tokens.ts:384`: removed unread `checkboxIndicator` registration (no component default/read existed). `docs/primitives/theme.md:36`: Chromium 118+, Firefox @scope 146/style queries 151+, Safari 18+ and document-container/scoped-control caveats, with compatibility sources. `:38`: unsupported browsers retain inherited aliases; explicit `theme` re-derives them and resets that boundary's semantic defaults. `docs/primitives/README.md:3` / `:7`: hook availability is per primitive; Switch has no separate hook and Tabs documents its controlled model. | `test/fix2-a-tokens.test.tsx:78`: “R20 removes the unread checkboxIndicator public token”; `test/fix-a-browser.test.tsx:58`: “re-derives aliases with an explicit theme when semantic rebinding is unsupported” (removes @scope rules from scratch CSS and checks both inherited aliases and the explicit-theme fallback in Chromium). |

The animation uniqueness and unused-token regression tests failed before the source changes and pass afterwards. The alias parity test passed before editing and now locks in the already-correct relationships. Browser support details were checked against current MDN compatibility data linked in theme.md.

## Shared-file request / remaining work

**C — `src/styles/overlays.css:471`:** delete only these six complete at-rule blocks (currently lines 471–506), retaining every selector and the following reduced-motion media block:

- `@keyframes onyx-sheet-right-enter`
- `@keyframes onyx-sheet-left-enter`
- `@keyframes onyx-sheet-top-enter`
- `@keyframes onyx-sheet-bottom-enter`
- `@keyframes onyx-overlay-enter`
- `@keyframes onyx-overlay-exit`

Their identical canonical definitions remain in `src/styles/globals.css:1471` through `:1505`, shipped by the normal stylesheet entry. R19's whole-library keyframe uniqueness is pending these deletions; A left C's file untouched as instructed. No runtime imports/exports or package/registry changes are requested.

## Verification

- `bun test test/fix2-a-tokens.test.tsx test/fix-a-browser.test.tsx`: **8 pass, 0 fail**, including all three real Chromium probes.
- `bun run typecheck`: **fail**, outside A ownership: `src/components/tree.tsx:76` TS2352, synthetic event object cast to `React.DragEvent` has incompatible `currentTarget`.
- `bun test`: **305 pass, 3 fail**, 308 tests / 37 files. Two failures are expected registry staleness (`derives dependency metadata from actual imports`, `has complete relative and package import closure including types and CSS layers`). The other is D's `Forms round 2 Chromium > R3 Switch aligns checked thumbs and R6 steppers retain all 24 by 24 hit pixels`: first stepper has **557/576** correct hit pixels in both densities; Switch geometry passed. Full output: `/tmp/onyx-fix2-a-tests.log`.
- `bun run build:css`: **pass**. It uses the normal Tailwind command without an Onyx PostCSS pass.

No intended visual change and no new screenshots. Chromium verified cascade behavior, portable animations and the compatibility fallback through computed styles.
