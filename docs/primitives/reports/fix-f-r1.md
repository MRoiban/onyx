# Fix F — Display & layout, round 1

All assigned findings fixed. Work remains uncommitted on `feat/primitives-expansion`. Only F-owned source, display docs/tests, screenshots, this report, and the explicitly requested new shared focus helper were edited. Legacy Toast parts were compared against `git show HEAD:src/components/toast.tsx`; their element types, ref types, legacy classes, slots and ToastProgress value contract remain compatible. Progress source was not changed.

## Findings fixed

Tests below live in `test/fix-f-display.test.tsx` unless noted.

| Finding | Implementation | Regression test |
| --- | --- | --- |
| #11 | `src/components/layout.tsx:57`; defaults resolve in `src/styles/display.css:459`. Stack/Inline/Container/Grid emit custom properties only for supplied props; explicit style merges last. | `#11 leaves layout default style attributes absent and writes only supplied decisions` |
| #22 | `src/components/toast.tsx:247,422`; `src/lib/use-removal-focus.ts:12`. Focused toast is pinned across overflow. Removed focused cards restore next/previous equivalent slot or control index, then the previous outside element, then viewport tabIndex=-1. | `#22 restores equivalent action then previous outside focus when dismissing`; `#22 close and Escape dismissal use survivor then viewport fallback`; `#22 overflow pins focused toast until focus leaves`; `#22 expiry races restore focus using the same removal path` |
| #23 | `src/components/tag.tsx:79`; same helper as Toast. DOM removal, rather than one keyboard path, drives restoration. Supports next, previous, consumer onEmpty, fallbackRef and focusable group; delayed controlled removal works. | `#23 click/Enter/Space/Delete/Backspace restores next, previous, then empty group focus` (five parameterized cases); `#23 last removal honors fallback ref and consumer onEmpty`; `#23 controlled asynchronous removal restores focus after DOM commit` |
| #49 | `src/components/toast.tsx:240,251,270,392,397`. One provider-owned announcer consumes an event queue. Enqueue and update events serialize with a blank interval, identical messages repeat, dismissal is silent, multiple viewports share it. Batched enqueue/update retains both events. | `#49 one provider announcer serializes enqueue/update repeats and dismisses silently`; `#49 enqueue followed by update in one batch announces both events` |
| #50 | `src/components/toast.tsx:238,244,284`. Environment initializes in an effect; timers remain paused until initialization, including hidden documents. No document access during SSR initialization. | `#50 hidden document mounts paused before scheduling initial queue` |
| #51 | `src/components/badge.tsx:55,105`. Normalize value/max once; aria-label uses normalized value, finite values truncate; max below 1/nonfinite disables cap. | `#51 normalizes Count value and max for text and accessible label` |
| #52 | `src/components/avatar.tsx:20`. NFC-normalized first/last graphemes through Intl.Segmenter, with Unicode regex fallback for combining marks, emoji flags/modifiers/ZWJ. Empty = ?, single name = one grapheme. | `#52 initials preserve NFC and emoji graphemes with and without Segmenter` |
| #53 | `src/components/toast.tsx:317`. Finite durations run in chunks bounded by 2³¹−1 ms. Elapsed accounting remains correct over pauses and chunk boundaries; Infinity persists. | `#53 long durations use bounded chunks and preserve elapsed time across pauses` (fake timers) |
| #58 | `src/components/badge.tsx:68,87`; `src/components/avatar.tsx:17`. Consistent documented companion-attribute convention: badgeAttributes/avatarAttributes supply defaults, generic displayAttributes covers other data-driven display variants. All display docs explain class + attribute pairing. | `#58 companion attributes render custom Badge and Avatar variants` |
| #59 | `src/styles/display.css:86`. Count honors solid/subtle/outline; docs include its default, normalization and invalid-max behavior. Other display docs clarify variant helper requirements and revised focus/announcer behavior. | `#59 Count CSS honors subtle and outline variants`; browser computed-style check distinguishes all three variants |

Updated the existing `src/components/display.test.tsx` announcement assertion to wait for event-driven publication instead of expecting dismissal to synchronously announce a queue position.

## Not fixed

None of F's assigned findings remain open. Screen-reader announcements are structurally tested; no manual assistive-technology pass was performed.

## Shared-file requests

- New runtime helper: `src/lib/use-removal-focus.ts`, imported by Tag and Toast. Agent B/orchestrator should preserve this helper in Tag/Toast registry import closure when running registry sync (the current registry already lists it in both closures). F did not edit registry.json, scripts, hooks barrels, package.json or src/index.ts.
- New public exports: `displayAttributes`, `badgeAttributes` from badge; `avatarAttributes` from avatar; `TagGroupOptions` from tag. Existing star exports already expose them; no index edit is necessary. The generic display helper is deliberately available from badge for all display custom markup. Avatar already has a runtime badge dependency.
- `useRemovalFocus` is an internal shared helper; no public root export is required. If other agents need the same pattern, use its ref + item selector + fallback/onEmpty/returnToPrevious options rather than duplicating restoration.
- No new package dependencies.

## Validation

- `bun run typecheck`: **passed** on the final run. Earlier runs caught in-flight Forms/Overlays edits; no F source errors occurred.
- `bun test`: an earlier complete snapshot passed (**259 pass, 0 fail**, 30,778 assertions, 28 files). The latest run after more concurrent edits has **258 pass, 3 fail**, 30,181 assertions, 28 files: two registry staleness/closure failures (new PasswordField form-reset import and Field dependency metadata), plus the token-contract test reporting Forms CSS `--onyx-input-padding-y` as unregistered. These failures are outside F-owned files; the orchestrator should rerun registry sync and reconcile that Forms token with agent A. An earlier SearchField inherited-disabled failure was resolved by its owner. All F tests pass.
- Owned tests (`bun test test/fix-f-display.test.tsx src/components/display.test.tsx src/components/progress.test.tsx`): **37 pass, 0 fail**, 141 assertions.
- Owned tracked-file `git diff --check`: passed.
- Browser at localhost:4816, 1280 CSS pixels, dark/compact: verified ancestor custom properties yield 0px gaps for Stack/Inline/Grid, 0px Container padding, and two Grid columns; all default-style probe elements have no style attribute. Rendered gallery default Inline/Container instances also have no inline styles and honor ancestor overrides.
- Count computed styles: solid uses solid tone surface/foreground, subtle uses subtle tone surface/foreground plus 1px border, outline uses transparent surface plus tone foreground/border.
- Gallery hot-module replacement briefly retained an old Toast context after module edits; full navigation cleared it. Captures contain the rendered gallery without runtime error.

## Visual changes and screenshots

Only new Count subtle/outline styling changes visible output when those variants are requested. Default display/layout visuals are preserved; ancestor overrides now affect default layout instances. Focus restoration and event announcements do not otherwise change the gallery's appearance. Concurrent token/form changes are naturally included in these shared-checkout captures.

- `gallery/screenshots/fix-f-feedback-1280-dark-compact.png` — 1280×1200; complete Feedback section including live toast demo.
- `gallery/screenshots/fix-f-layout-1280-dark-compact.png` — 1280×600; complete Layout section.

Both screenshots were saved through T3 preview and visually inspected. No gallery source change was required.
