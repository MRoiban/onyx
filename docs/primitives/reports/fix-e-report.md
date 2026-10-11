# Fix E · Collections · round 1

Completed in the shared, uncommitted `feat/primitives-expansion` checkout. Only E-owned component/style/docs/test/gallery files were edited; no commits or consumer repository edits. Read the coordination/review/W3 notes and Babel's ExplorerView before implementation. Existing Tabs exports/props remain compatible with HEAD; new move APIs are additive.

## Findings fixed

All regression tests below are in `test/fix-e-collections.test.tsx`.

| Finding | Implementation | Regression test |
|---|---|---|
| #21 | `src/components/tree.tsx:83`, `:201`, `:214`, `:229`, `:318`, `:588`: additive `onMoveItem`, shared `canMove`, headless `moveItem`, explorer cut/paste keys, Escape cancellation, cut state and polite live region. Self/descendant/disabled targets are rejected. Existing event-based canDrop/onDropItem remain compatible. | `tree keyboard cut paste supports all positions and Escape with polite results`; `tree headless moves and DnD share canMove rejection` |
| #37 | `src/components/listbox.tsx:172`, `:182`: focus-only navigation updates the range anchor, including tree child/parent navigation through the headless setter. Existing collection test's stale Home→Shift+Down expectation updated to Alpha–Beta. | `listbox anchors Shift+Up at focus after End`; `tree anchors Shift+Up at focus after End` |
| #40 | `src/components/listbox.tsx:58`, `:194`: memoized key→index map and selected-key Set give constant-time per-row props; `src/components/tree.tsx:346` skips the discarded list position lookup. | `getItemProps uses linear getKey calls for 12,480 rows`; `tree row props avoid scanning the collection for positions` (both enforce ≤3×n getKey calls) |
| #55 | `src/components/listbox.tsx:145`: prefix refinement tests the current item first; new searches and repeated-character cycles start after it. Shared with Tree. | `typeahead refinement keeps matching focus and repeated characters cycle`; `typeahead repeated character starts after current match` |
| #38 | `src/components/listbox.tsx:405`, `src/components/tree.tsx:595`, `src/styles/collections.css:24`: custom rowHeight sets viewport `--onyx-row-height`, consumed by row height and minimum height. | `listbox custom row height controls CSS geometry`; `tree custom row height controls CSS geometry` |
| #39 | `src/components/tabs.tsx:116`: tablist DOM focus model solely owns tabIndex; triggers no longer write competing React indices. Roving focus stays tabbable while inside; selected enabled tab becomes the stop on exit, with first-enabled fallback. Controlled changes and dynamic tab attributes reconcile. | `tabs have one roving stop and return to controlled selection on exit` |
| #30 | `src/components/carousel.tsx:51`, `:100`: goTo requests state; accepted rendered index effect owns scrolling. A rejected controlled settled scroll returns to the rendered index. | `controlled carousel scrolls only to accepted index` |
| #54 | `src/components/split-view.tsx:191`: storage availability getter is inside try/catch alongside reads; writes already guarded. | `SplitView tolerates throwing localStorage availability getter`; `SplitView renders on the server without storage` |
| #56 | `src/components/pagination.tsx:69`: normalized total/pages for controlled/default state and setPage: finite floor, fallback 1, clamp to valid bounds. | `pagination normalizes initial controlled values and setPage` (2.5, NaN, 0, >total) |
| #57 carousel dots | `src/styles/collections.css:468`, `:485`: token-sized pseudo-element targets, 24-token gap and vertical padding; visible dot height stays 6px and active width stays 16px. | `carousel dot targets use nonoverlapping 24 token hit areas`; browser measurement confirms 24×24 targets with center spacing 35px/30px |
| #12 TabBadge | `src/components/tabs.tsx:314`: fixed 10px replaced by density-aware `--onyx-text-xs`. | `TabBadge uses the density-aware type token` |

## Keyboard move model and docs

Documented in `docs/primitives/tree.md`: Ctrl/⌘+X marks the selected keys (or focused row outside selection); navigate; Ctrl/⌘+V requests inside, Ctrl/⌘+Shift+V before, Ctrl/⌘+Alt+Shift+V after. Escape cancels. The callback owns model mutation; announcement reports dispatch, while the consumer reports asynchronous failures. `canMove(sourceKeys,target)` governs keyboard and internal DnD; legacy `canDrop(target,event)` remains an additional pointer gate. Headless consumers mount the returned `announcement.text` in a polite region and use `announcement.revision` for repeated events.

Updated Listbox, Tabs, Carousel, Pagination and SplitView docs as well. Gallery FileTree now demonstrates the same keyboard/internal-DnD move callback and displays key help.

## Not fixed

None within E's assigned findings. Full-check failures outside E ownership are recorded below rather than edited.

## Shared-file requests

None. No new imports requiring dependency changes, exports, registry items, or shared helper files. The final coordinator should perform its planned registry sync after all agents finish.

## Verification

- `bun test test/collections.test.tsx test/fix-e-collections.test.tsx`: **45 pass, 0 fail**, 26,324 assertions. This includes 17 new regressions and all 28 existing collection tests.
- Latest `bun run typecheck`: blocked by D-owned files: duplicate aria props in `src/components/color-picker.tsx:161–177`, nullable aria-invalid in `src/components/radio-group.tsx:23`, and nullable element passed to fireEvent in `test/fix-d-forms.test.tsx:153`. No E-file errors were reported. Earlier checks encountered temporary incomplete concurrent edits.
- Latest `bun test`: **251 pass, 1 fail** across 27 files. Sole failure: D-owned `forms fix round D > SearchField clear and Escape respect inherited disabled`. Registry staleness seen in prior runs has cleared as B's work progressed. Logs: `/tmp/onyx-fix-e-tests-final.log`, targeted `/tmp/onyx-fix-e-targeted.log`.
- Existing gallery server reused at `http://localhost:4816/?theme=dark&density=compact`; native T3 preview at **1280×900**, screenshots saved and visually inspected. Actual tree row height measured 22px in compact. Carousel pseudo-element targets measured 24×24 with nonoverlapping center spacing and visible height 6px.

## Visual changes and screenshots

Visible carousel dots retain geometry while gaining hit areas and wider spacing. TabBadge follows the type token. Gallery tree adds move help; custom rowHeight now controls actual geometry.

- `gallery/screenshots/fix-e-collections-dark-compact-1280.png`
- `gallery/screenshots/fix-e-carousel-dark-compact-1280.png`
