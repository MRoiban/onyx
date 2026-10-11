# Fix round 1 — B: Registry, compatibility and shared libraries

All assigned findings are implemented: #2, #3, #4, #5, #19, #20, #24, #46, #47, #48 and Button's portion of #57. No commits. Other agents' files were not edited.

## Fixes and regression tests

Component/hook tests below are in `test/fix-b-shared.test.tsx`; registry tests are in `src/registry.test.ts`.

| Finding | Implementation | Regression test name |
|---|---|---|
| #2 | `src/components/sidebar.tsx:581`: optional context wrapper renders the HEAD standalone div and forwards ref, classes and handlers; provider path delegates to existing ResizeHandle implementation. | `SidebarRail preserves the standalone HEAD div and consumer handlers`; `SidebarRail keeps provider ResizeHandle keyboard resizing` |
| #3 | `scripts/sync-registry.ts:80`: follows relative type imports and includes type-only package imports. Progress and EmptyState now depend on badge. | `ships relative type imports and declares CSS and type-only package dependencies`; `has complete relative and package import closure including types and CSS layers` |
| #4 | `scripts/sync-registry.ts:81`: parses CSS imports, including quoted imports with layer suffixes and quoted url imports; theme declares @vscode/codicons. | `ships relative type imports and declares CSS and type-only package dependencies`; `has complete relative and package import closure including types and CSS layers` |
| #5 | `src/components/hooks.ts:1`, `src/components/portal.ts:1`, `src/components/visually-hidden.ts:1`: component-path compatibility entries are the registry primary files. `src/hooks.ts:1` keeps the existing package subpath. | `provides a components entry for every registry item used by Bedrock barrels`; Bedrock simulation described below |
| #19 | `src/lib/use-roving-focus.ts:14`, `src/lib/use-roving-focus.ts:39`: editing widgets have independent tab stops and their own keys; toolbar actions retain one roving tab stop. Documented in `docs/primitives/toolbar.md:11`. | `editing widgets retain independent tab stops and native keys beside toolbar actions` |
| #20 | `src/lib/use-roving-focus.ts:25`: excludes hidden inputs, hidden/inert/aria-hidden elements and ancestors, CSS-hidden elements and ancestors, disabled controls. | `roving focus excludes hidden, disabled, inert, aria-hidden and CSS-hidden candidates` |
| #46 | `src/lib/use-roving-focus.ts:53`: observes subtree ancestor mutations, including inert, hidden, disabled, aria-hidden, class and style. | `roving focus refreshes dynamic ancestor inert hidden and disabled changes` |
| #47 | `src/components/button.tsx:94`, `src/components/button.tsx:139`, `src/components/button.tsx:161`: blocked asChild handlers are replaced before Slot composition; click/pointer/key capture prevents activation. | `blocked asChild Button never invokes child or consumer activation handlers` |
| #48 | `src/lib/use-floating-position.ts:26`: retains and restores original inline width and priority, clears initially absent width, guards late positioning callbacks after cleanup; middleware options expose matchWidth changes to Floating UI. | `floating width restores consumer width when matching is turned off and on cleanup` |
| #24 | `src/components/section-select.tsx:377`, `src/components/command.tsx:49`, `src/components/command.tsx:55`: visible focus rings use --onyx-control-focus-ring. | `SectionSelect and CommandInput expose token focus rings` |
| #57 (Button) | `src/components/button.tsx:39`, `src/components/button.tsx:46`: centered absolute pseudo-elements expand xs/icon-xs targets to 1.5rem without changing visible dimensions. | `compact Button hit areas preserve visible geometry and expand centrally to 24px`; browser hit-test evidence below |

## Registry decisions

Type-only package imports **do** require package dependencies: the shipped TypeScript sources must resolve their declarations in the consumer's compiler. React and React DOM remain peer dependencies. Tests include a fixture with only a type import from @floating-ui/react-dom and a relative type import from badge, plus a CSS fixture with a layered codicons import.

The closure test recursively collects each item's registryDependencies, shipped files and declared package dependencies, then checks every relative and package import, including types and CSS imports. Sync remains deterministic and idempotent.

Public exports and package subpaths are preserved. Added @radix-ui/react-dismissable-layer to package dependencies to match agent C's concurrently added runtime imports.

## Bedrock and Babel compatibility

Read only: Bedrock's `packages/ui/scripts/sync-onyx.ts` and `sync-onyx.test.ts`. Ran `/tmp/fix-b-bedrock-simulation.ts`, using an exact copy of Bedrock's sync with only the unavailable BedrockError import replaced by a local error class. All output goes to /tmp. No Bedrock edits.

Latest output:

```text
Bedrock selected=19; closure=24; generated barrel targets=24; bundle=PASS; idempotence=PASS; hooks/portal/visually-hidden=PASS; output=/tmp/fix-b-bedrock-output-LmoQ8c
```

The simulation runs Bedrock's real selection and recursive closure twice, compares version/hash results, verifies every generated component barrel target exists, checks all three compatibility entries, and bundles the generated barrel with consumer package dependencies externalized.

Read only: Babel's `core/generate-bricks-runtime.ts:9` reads package.json exports and builds each .ts export target; it does not synthesize components/<item> paths. Its `core/shared/brick-api.ts:107` exposes root Onyx exports to bricks. The retained exports/subpaths preserve these assumptions, and standalone SidebarRail works again.

## Visual verification

A temporary standalone page served rendered Onyx components and the actual gallery CSS at localhost:4817; this avoided concurrent gallery hot-reload errors. No gallery source edits.

Browser measurements in compact density:

- icon-xs visible size: 20×20; pseudo-element hit size: 24×24.
- ToolbarGroup gap: 4px. At one pixel beyond either visible edge, hit testing resolves the correct button; neighbour extensions do not overlap.
- SectionSelect: visible 2px token-coloured focus ring.
- CommandInput and shell: visible 2px inset token-coloured rings.

Screenshots:

- SectionSelect focus and compact buttons: `/Users/stellar/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mv3kl4cd-f8412870.png`
- CommandInput focus and shell: `/Users/stellar/.t3/userdata/browser-artifacts/browser-screenshot-localhost-mv3kluro-5321c11f.png`

## Verification and outstanding integration results

- B regression tests plus registry tests: **16 pass, 0 fail**.
- Last full `bun test`: **255 pass, 1 fail** across 27 files. Remaining failure belongs to D: `forms fix round D > SearchField clear and Escape respect inherited disabled`.
- Last `bun run typecheck`: errors exclusively in D-owned work: duplicate ARIA prop spreads in `src/components/color-picker.tsx:161`–177; nullable label id in `src/components/radio-group.tsx:23`; nullable input passed to fireEvent in `test/fix-d-forms.test.tsx:153`.
- `bun run registry:sync`: pass, rerun after full tests.
- `bun scripts/sync-registry.ts --check`: pass after final sync.
- Full test log: `/tmp/fix-b-tests-final.log`; typecheck log: `/tmp/fix-b-typecheck-final.log`; targeted test log: `/tmp/fix-b-targeted-final.log`.

Assigned findings not fixed: none. The integration failures above were not changed because those files belong to agent D and were being edited concurrently.

## Shared-file requests

None outstanding from B. B performed its own registry and package changes. Other agents' additional shared-file requests remain the orchestrator's responsibility.
