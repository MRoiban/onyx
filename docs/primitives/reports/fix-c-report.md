# Fix round 1 — C: Overlays

Implemented in the shared checkout on `feat/primitives-expansion`, without commits or edits to another agent's source files. Context-menu was not edited in this round. Generated `gallery/onyx.css` was rebuilt for visual verification.

## Findings fixed

Regression tests are in `test/fix-c-overlays.test.tsx`.

| Finding | Implementation | Regression test |
|---|---|---|
| #25 | `src/components/popover.tsx:7` supplies the portal-container context; `sheet.tsx:79` and `alert-dialog.tsx:47` provide their actual content elements. `combobox.tsx:454` uses Radix DismissableLayer, preserves trigger interaction, and explicitly enables popup pointer events. | `modal Sheet portals are interactive and nested floating parts stay inside its stacking context` (computed/inline pointer-events, pointer selection, keyboard selection, Escape and outside interaction); `AlertDialog floating Combobox remains in its focus scope and accepts pointer selection` |
| #26 | Floating content/portal parts in Combobox, Popover, Menu/submenus, Menubar/submenus, Tooltip and HoverCard inherit the modal host. NavigationMenu also inherits it; DatePicker uses PopoverContent. Explicit container overrides remain available. | Same modal Sheet test checks popup containment; real-browser DatePicker/Menu hit-testing and screenshots confirm they are above the Sheet. |
| #27 | `src/components/date-picker.tsx:187` leaves the draft unnamed; hidden inputs at `date-picker.tsx:270` serialize committed local dates as ISO yyyy-mm-dd. Invalid drafts preserve committed state and expose invalid attributes. | `DatePicker submits the committed ISO value and preserves it on invalid drafts` |
| #28 | `src/components/date-picker.tsx:79` displays the controlled value after rejected selection/commit. `date-picker.tsx:158` reconciles drafts when a parent render reasserts the same controlled value. | `controlled DatePicker displays the controlled value after rejected typing and calendar selections`; `DatePicker reconciles a typed draft when the parent reasserts the same controlled Date` |
| #31 | `src/components/combobox.tsx:84` synchronizes selected labels for controlled/uncontrolled values as options arrive/change, while preserving an active user query and explicit initial query. | `Combobox refreshes selected labels without replacing an active query` |
| #32 | `src/components/combobox.tsx:83` tracks active identity by option value (or create query), resolving its current index after reordering and clearing removed/disabled identities. The existing controlled activeIndex API stays consumer-owned. | `Combobox preserves active option identity across reorder and clears removed/create options`; `Combobox default active option also follows its value across reorder` |
| #41 | `src/components/date-picker.tsx:274` and `:286` associate both hidden range values with root form or inputProps.form (root wins). | `DatePicker range form association accepts root form and inputProps.form` |
| #42 | `src/components/popover.tsx:79` adds an inner scroller with a direct arrow outside it; asChild content scrolls directly. `src/styles/overlays.css:592` constrains and scrolls NavigationMenu content/viewport. | `constrained Popover and NavigationMenu content and viewport enable scrolling`; `Popover scroll wrapper preserves a direct arrow outside scrolling content` |
| #58 (assigned composites) | `src/components/combobox.tsx:311` and `date-picker.tsx:125` expose root style, rootProps and rootRef, keeping inputProps and the legacy input ref separate. Root classes/styles merge. | `composite root styling and refs are separate from input props and legacy input refs` |

## Not fixed / integration notes

No assigned finding remains unimplemented. DialogContent is owned by A and was not edited. Consumers can capture its element with a callback ref and use `PortalContainerProvider`, or pass `container` to floating content (DatePicker: `contentProps.container`). The complete example is in `docs/primitives/popover.md`; the same integration note is in each overlay doc. A may additionally provide the context directly from DialogContent.

The portal context intentionally lives in the owned Popover module; no new shared lib file was added. A controlled `activeIndex` continues to mean the consumer's explicitly provided index, preserving the existing API. Internally managed/default active options use values.

## Shared-file requests

- Registry dependency closure must include **popover** for Combobox, Sheet, AlertDialog, Menu, Menubar, Tooltip, HoverCard and NavigationMenu, which now import portal-container context from it. Sheet and AlertDialog also import `src/lib/compose-refs.ts` (hooks registry closure).
- Combobox directly imports **@radix-ui/react-dismissable-layer**. It is already present in package.json at verification time; preserve it in package/registry metadata.
- `PortalContainerProvider` and `usePortalContainer` are new Popover exports. Existing wildcard exports in `src/index.ts` and `src/popover.ts` already expose them; no index edit is requested.
- Full-suite token coverage currently reports `forms.css: --onyx-input-padding-y`; this is outside C ownership and needs coordination between D and A.
- B should perform the final registry sync after concurrent edits settle.

No shared manifest/index file was edited by C.

## Verification

- `bun run typecheck`: **pass** on the final source.
- `bun test test/fix-c-overlays.test.tsx test/overlays.test.tsx`: **23 pass, 0 fail**, 110 assertions. Twelve new regression tests plus eleven existing overlay tests.
- Latest `bun test`: **259 pass, 3 fail**, 30182 assertions, 28 files. Failures: the two expected stale registry metadata/closure tests and the cross-agent public-token coverage failure for `forms.css: --onyx-input-padding-y`. No overlay failure. An earlier integration run passed all 259 then-existing tests; subsequent concurrent additions changed the suite.
- `bun run build:css`: pass.
- Scoped `git diff --check`: pass.

## Visual verification

Gallery reused at http://localhost:4816, `?section=overlays&theme=dark&density=compact`, viewport **1280 × 800**. Added a real, interactive "Open nested overlay Sheet" demo to `gallery/sections/overlays.tsx`, containing Combobox, DatePicker, Menu and a constrained Popover.

The collaborative browser initially verified pointer selection and layering, then disconnected with: "No preview automation host is available for evaluate ... Do not retry." Final captures use the repository-documented headless Chromium through CDP, with actual mouse/key input and settled animations.

- `gallery/screenshots/fix-c-combobox-sheet.png`: popup remains inside Sheet; clicking English changes the input to English.
- `gallery/screenshots/fix-c-date-picker-sheet.png`: calendar above Sheet controls; nested=true, elementFromPoint hit=true, computed opacity=1 and opaque menu background.
- `gallery/screenshots/fix-c-menu-sheet.png`: menu above Sheet controls; elementFromPoint hit=true and opacity=1.
- `gallery/screenshots/fix-c-popover-scroll-sheet.png`: constrained inner scroller, clientHeight=120, scrollHeight=390, scrollTop=100; arrow remains outside the scroller.
- `gallery/screenshots/fix-c-navigation-scroll.png`: actual gallery NavigationMenu content constrained to 40px and supplied additional DOM rows for a browser-only stress probe; overflow=auto, clientHeight=38, scrollHeight=877, scrollTop=100. The temporary stress content was not saved to gallery source.

Inspected the settled DatePicker/Menu/Popover screenshots. Panels are opaque, interactive and visibly above the Sheet rather than behind its backdrop or controls. No z-index escalation was needed: nesting supplies the modal stacking context and inherits local theme values.
