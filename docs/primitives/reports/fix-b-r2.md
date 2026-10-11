# Fix round 2 — B: Registry, compatibility and shared libraries

R14 and R15 are complete. No commits. Tag/Toast components and other agents' source files were not edited. Existing removal-focus signatures and return values remain backward compatible; the eligibility helper is exported from use-roving-focus and consequently the existing hooks barrel.

## Item locations and regression tests

- **R14:** `src/components/button.tsx:39` and `:46` reserve token-based margins around the centered targets and prevent flex shrinking. `docs/primitives/button.md:23` documents the spacing rule. `test/fix2-b-button-browser.test.tsx:22`: **reserves 24px hit targets without covering zero-gap neighbour boxes in rows, columns, Toolbar and InputGroup**. The existing B round-1 class assertion was updated to the token-based target size.
- **R15:** `src/lib/use-roving-focus.ts:17` exports **isFocusableCandidate**, used by roving navigation at `:37` and removal focus at `src/lib/use-removal-focus.ts:46` / `:58`. Removal attempts check activeElement at `:52` / `:60` and try remaining controls, neighbours, onEmpty and fallback. `test/fix2-b-focus.test.tsx:19`: **shares candidate eligibility for disconnected, CSS-hidden and inaccessible controls**; `:26`: **skips CSS-hidden neighbours and hidden inputs**; `:32`: **falls through a silently failed focus to the next neighbour**; `:39`: **runs onEmpty and fallback when every neighbour fails focus**.

All three focus recovery regressions were run before implementation: 0 pass, 3 fail. They now pass. The R14 browser test also fails with `ONYX_BUTTON_BASELINE=1`, which removes only the new margin reservation from the rendered fixture without editing source: 40 visible pixels per leading button are stolen by its neighbour.

## Real Chromium geometry and pixel measurements

The installed Chromium headless shell runs against rendered actual Button, Toolbar/ToolbarGroup and InputGroup/InputGroupInput components with the actual compiled Onyx CSS. The test samples each visible box and centered minimum target using document.elementFromPoint at integer CSS-pixel coordinates.

- Ten buttons across horizontal zero-gap icon-xs, zero-gap xs, vertical zero-gap icon-xs, zero-gap ToolbarGroup and zero-gap InputGroup trailing rows.
- Every icon-xs remains 20×20 visible; xs remain 22.328125×20 / 22.046875×20 for the fixture labels.
- Pseudo-elements are 24×24; compact margins are 2px on every side.
- Every sampled visible box: **0 stolen pixels**. Every sampled enlarged target: **0 missed pixels**. Adjacent InputGroup input: **0 stolen pixels**.
- Comfortable density uses a 24px visible control and zero reserved margin. Extra container gaps are additive; consumers must preserve the reserved margins.

The live gallery http://localhost:4816 returned HTTP 200. A T3 collaborative Chromium tab confirmed actual gallery icon-xs controls retain 20×20 boxes, 2px margins and 24×24 pseudo-elements. No screenshot artifact was created; the reproducible geometry/hit-test assertions are the visual evidence.

## Verification

- `bun run typecheck`: **PASS**, latest log `/tmp/fix2-b-typecheck-final.log`.
- Latest `bun test`: **308 pass, 1 fail**, 309 tests across 37 files. B's five new tests, existing B regressions, registry tests and F's Tag/Toast removal tests all pass.
- Remaining failure: D-owned `test/fix2-d-browser.test.tsx:63`, **Forms round 2 Chromium > R3 Switch aligns checked thumbs and R6 steppers retain all 24 by 24 hit pixels**, received 557 expected 576. Not edited because it belongs to D. Log `/tmp/fix2-b-tests-final.log`.
- `bun run registry:sync`: **PASS**; `bun scripts/sync-registry.ts --check`: **PASS**. Regenerated shared registry metadata includes the helper's relative import closure.
- `bun /tmp/onyx-r2-bedrock.ts`: **PASS**, no error printed. It writes only `/tmp/onyx-r2-bedrock-output`. Latest output is recorded below and in `/tmp/fix2-b-bedrock-final.log`.

Assigned items not done: none. Shared-file requests: none.

```text
commit f63d9aa74550e03d942a058da1f4fbdd01b5a26b
sha256 fca469e88f2763660280b4cec4d7c4fa458375089f04cb10da703b45197d3e11
```
