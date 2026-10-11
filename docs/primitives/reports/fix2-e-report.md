# Fix E · Collections · round 2

R13 is complete in the shared, uncommitted `feat/primitives-expansion` checkout. Only E-owned files were edited; no commits. The existing gallery server was reused.

## R13 → implementation and regressions

- **Both acceptance gates for every move path:** `src/components/tree.tsx:245` centralizes `canDropAt`; `:248` gates `moveItem`; `:367` gates drag-over; `:378` rechecks acceptance at drop. Keyboard paste, headless calls and pointer actions all dispatch through `moveItem`. Structural/source checks and `canMove` precede `canDrop`; rejection cannot dispatch `onMoveItem`. Internal drop acceptance runs once at dispatch, preserving the actual drag event. External drops retain `onDropItem` ownership.
- **Existing canDrop signature preserved:** `src/components/tree.tsx:72` supplies a synthetic React-compatible drop event for non-drag moves, with the default internal drag's first-source-key text/plain payload. It has no DOM target or pointer geometry, is untrusted, and is documented accordingly. Actual drag events pass through unchanged.
- **Headless pointer actions:** `src/components/tree.tsx:259` exposes `cutItem(key)`; `:273` exposes `cancelMove()`; `:274` exposes `pasteItem(targetKey,position)`. Cut uses the selected keys when the source belongs to the selection, rejects disabled/disallowed sources, and announces marking. Rejected paste retains the cut for another target; successful paste clears it. All actions use the same live-region announcement state.
- **Default Tree single-pointer alternative:** `src/components/tree.tsx:646` renders a separate action group beside the tree root when `onMoveItem` is supplied: current target, Cut, Paste before/inside/after, Cancel move. Existing root/ref/asChild bindings stay on the tree element. Existing Onyx Buttons are reused; custom headless controls need not render them. `src/styles/collections.css:61` styles the wrapping group using tokens.
- **Docs/gallery:** `docs/primitives/tree.md:13` documents pointer and keyboard workflows; `:15` documents both gates, the event contract and headless actions; `:23` lists the APIs. `gallery/sections/collections.tsx:370` demonstrates the default actions with visible pointer instructions at `:372`.

All new tests are in `test/fix2-e-tree.test.tsx`:

| Coverage | Test name |
|---|---|
| R13 keyboard rejection | `keyboard paste respects canDrop false for every position` (`:10`) |
| R13 direct headless rejection | `headless moveItem respects canDrop false without dispatch` (`:24`) |
| R13 single-pointer dispatch and announcements | `R13 pointer Cut and Paste before/inside/after dispatch and announce without dragging` (three cases, `:35`) |
| R13 both pointer/headless gates and cancellation | `R13 pointer and headless paste respect canDrop/canMove and retain cut for retry` (two cases, `:51`) |
| R13 event payload compatibility | `R13 canDrop sees the same source payload for headless and internal DnD moves` (`:69`) |
| R13 structural/source rejection | `R13 cut rejects disabled sources and paste rejects self and descendants` (`:81`) |

The first two tests were run before implementation and both failed: keyboard incorrectly announced a dispatched move, and direct `moveItem` returned true. After implementation all nine new tests pass.

## Verification

- `bun run typecheck`: **pass**. Log: `/tmp/onyx-fix2-e-typecheck.log`.
- Final `bun test`: **311 pass, 0 fail**, 35,253 assertions across 37 files. Log: `/tmp/onyx-fix2-e-tests.log`.
- Targeted `bun test test/collections.test.tsx test/fix-e-collections.test.tsx test/fix2-e-tree.test.tsx`: **54 pass, 0 fail**, 26,370 assertions. Log: `/tmp/onyx-fix2-e-targeted.log`.
- An earlier concurrent full run had two expected registry-staleness failures and two D-owned Chromium failures; all cleared in the final run.
- CSS rebuilt with `bun run build:css` for gallery verification. The initial T3 browser confirmed all five move controls were 24px high, then disconnected with `No preview automation host is available ... Do not retry.` Verification continued with the installed Chromium headless shell through CDP, using real mouse press/release events.
- Chromium gallery verification at 1280×900: pointer Cut marked the two default selected files; selecting `assets` and clicking Paste inside announced **“Moved 2 items inside assets.”** Expanding assets showed `fr.json` and `default.json` beneath it at level 4. Successful paste disabled paste/cancel controls. Compact action buttons were **24px high**, widths 38–92px. Dark/compact and light/comfortable screenshots were visually inspected; wrapping controls fit within the gallery cell.

## Screenshots

- `gallery/screenshots/fix2-e-tree-cut-dark-compact.png`
- `gallery/screenshots/fix2-e-tree-moved-dark-compact.png`
- `gallery/screenshots/fix2-e-tree-light-comfortable.png`

## Shared-file requests

New runtime import: `src/components/tree.tsx` → `./button`. B should retain the derived tree→button registry dependency in its final sync; the final registry tests already pass. No new public exports or package dependencies are needed. No shared files were edited by E.

## Not done

None within R13. The synthetic non-drag canDrop event's lack of pointer geometry/DOM target is an explicit documented contract; consumers needing collection rules should use `canMove`.
