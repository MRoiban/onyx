# Fix F — Display & layout, round 2

R16 and R17 are complete. Changes remain uncommitted. Only F-owned display/layout sources, CSS, tests, docs and this report were edited. `src/lib/use-removal-focus.ts` was not edited.

## Items and regression evidence

### R16 — standalone variant classes

- `src/components/badge.tsx:7`: shared tone modifier map; Badge (`:8`), Count (`:51`) and StatusDot (`:134`) emit visual option classes. Count and StatusDot components now pass their options to cva.
- `src/components/avatar.tsx:7`: size/shape classes.
- `src/components/alert.tsx:7`, `src/components/skeleton.tsx:5`, `src/components/card.tsx:5`, `src/components/separator.tsx:5`, `src/components/link.tsx:6`, `src/components/empty-state.tsx:8`: visual option classes for all requested display roots.
- Additional affected helpers fixed: `src/components/layout.tsx:9` (Container size), `src/components/tag.tsx:10` (tone), `src/components/meter.tsx:6` (tone), `src/components/progress.tsx:35` (tone/indeterminate), `src/components/toast.tsx:196` (tone) and `:200` (viewport variant/state).
- `src/styles/display.css:2`: tone classes and data attributes share declarations. The same mechanism covers Badge (`:61`), Count (`:86`), StatusDot (`:100`), Alert (`:199`), Card (`:252`), Avatar (`:275`), Skeleton (`:335`), Progress (`:355`), Separator (`:378`), Link (`:410`), Container (`:481`), EmptyState (`:508`) and Toast viewport (`:550`, `:577`). Tag (`:125`) distinguishes a neutral class-only root while preserving attribute-only styling.
- Existing components retain data attributes, slots, refs, className merging and asChild. `displayAttributes`, `badgeAttributes` and `avatarAttributes` remain supported. No new colors, dimensions or tokens were introduced.
- Docs: `docs/primitives/badge.md:13`, `:23`; `docs/primitives/avatar.md:13`, `:23`; display companion docs now state that variant classes suffice and attribute helpers are optional.

Tests in `test/fix2-f-display.test.tsx`:

- `R16 variant options produce different standalone class strings` (`:23`).
- `R16 CSS covers every emitted display modifier on markup without attributes` (`:32`): renders class-only custom markup across every tone/variant/size, verifies every modifier has a CSS selector, and verifies Badge danger/outline and Avatar lg/square share the attribute declaration blocks.
- `R16 components retain data attributes and companion helpers remain supported` (`:68`).

The first two regressions failed before the implementation (identical option strings and zero modifiers); all three pass afterward. This uses the explicitly allowed CSS-rule coverage verification rather than a Chromium probe. Existing default component visuals are preserved; requested variants now also style custom markup without companion attributes. No screenshots were required or captured.

### R17 — deterministic timing tests

`src/components/display.test.tsx:14` uses `act(() => jest.advanceTimersByTime(ms))`; suite setup (`:17`, `:156`) installs fake timers and cleanup (`:15`) restores real timers after unmounting. All former wall-clock sleeps were removed, including Breadcrumb's 10ms wait. Existing assertions and elapsed intervals remain equivalent.

Converted test names:

- `pauses timers for hover, focus and window blur, resuming the remaining duration` (`:184`).
- `starts queued item timers only after they become visible and can reset duration` (`:208`).
- `dismisses the latest toast on Escape and exposes a polite live region` (`:226`).
- `pauses from viewport hover and dismisses swiped notifications` (`:244`).
- `provides breadcrumb navigation, current page, and real overflow menu` (`:80`).

`test/fix-f-display.test.tsx` already used fake timers for timed Toast regressions; its other async tests use user interaction or microtasks, not real sleeps. Progress tests contain no sleeps.

## Shared-file requests

Agent B should run registry sync after concurrent changes. Runtime imports of `displayToneClasses` from Badge were added to Alert, EmptyState, Meter, Progress, Tag and Toast (previously type-only Badge imports). Preserve their Badge runtime dependency metadata/import closure. The new exported map is already exposed through existing star exports; no barrel or package edit is needed. No dependencies were added. No shared focus-helper changes requested.

## Validation

- Owned tests: **40 pass, 0 fail**, 309 assertions across `test/fix2-f-display.test.tsx`, `test/fix-f-display.test.tsx`, `src/components/display.test.tsx`, `src/components/progress.test.tsx`.
- `bun run typecheck`: latest run fails only in E-owned `src/components/tree.tsx:76` (synthetic DragEvent cast / currentTarget incompatibility). An earlier run also caught E's in-flight `exact` options in Tree tests; those errors disappeared on the latest run. No F errors.
- `bun test`: **301 pass, 3 fail**, 32,606 assertions across 35 files. Two expected registry-staleness/import-closure failures; one B-owned `test/fix2-b-button-browser.test.tsx:59` failure in `reserves 24px hit targets without covering zero-gap neighbour boxes in rows, columns, Toolbar and InputGroup` (expected missed=0, received 24). All F tests pass in the full run.
- Owned tracked-file `git diff --check`: passed.

## Not done

No assigned item remains open. Full-checkout validation remains affected by the concurrent E/B work described above; those files were not edited by F.
