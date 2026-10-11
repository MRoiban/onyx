# Fix A: Tokens & cascade

A stayed within the assigned source/test/docs ownership, added the requested `tailwind.preset.cjs`, and wrote this report. No commits were made. Other agents' changes were not reverted.

## Findings implemented

| Finding | Implementation | Regression test |
|---|---|---|
| #7 | `src/styles/globals.css:623` removes boundary component defaults and uses direct fallbacks in A's own rules. `tailwind.preset.cjs:79` supplies the same defaults for existing reads in imported, unowned CSS and generated TSX utilities. Defaults resolve at use, so semantic density stays live and component overrides inherit across boundaries. **Build/watcher integration is still required below.** | `test/fix-a-browser.test.tsx`: “preserves ancestor component overrides, live density, semantic rebindings and unlayered consumer priority” |
| #8 | `src/components/theme.tsx:47`, `src/theme/tokens.ts:718`, `src/styles/globals.css:805`: dependency closure requests only affected aliases; nearest-theme scopes select their defaults, and custom-property style queries rebind only inherited defaults. Explicit root aliases and independently overridden inherited CSS aliases survive. No explicit `theme` prop is needed. | Browser test above; `test/fix-a-parts.test.tsx`: “theme roots request only affected aliases and preserve explicit variables” |
| #9 | `src/styles/globals.css:14`: explicit `@tailwind variants` inside `onyx.components` keeps checked/data/ARIA/group/responsive utilities layered. The fallback pass does **not** wrap or layer application CSS. | Browser test above: CSSOM finds zero unlayered library style rules; an unlayered consumer checkbox rule wins |
| #10 | `src/theme/tokens.ts:376` registers every current public CSS/TSX token read. `src/theme/tokens.ts:679` adds the typed exact-name `--onyx-${string}` escape hatch. Private instance geometry/state is listed separately. Existing keys/exports remain; default map now includes compact density and uses `initial` for tokens whose defaults live in CSS fallbacks. | `test/tokens.test.ts`: “registers every primitive CSS/TSX token read except documented private geometry”; parts test: “theme variables accept public component keys and the exact-name escape hatch” |
| #12 (A files) | `src/components/text.tsx:32`, `table.tsx:29`, `dialog.tsx:51`, `prompt.tsx:113`: text/weight/leading/spacing/control-height use Onyx tokens; dialog/prompt width geometry is tokenized. | `test/tokens.test.ts`: “assigned typography and geometry use theme tokens instead of Tailwind defaults or pixel calculations” |
| #13 | `src/styles/globals.css:1512` ships portable keyframes, animation classes and exact state-variant animation selectors; the later block supplies every named preset keyframe/animation, including toast aliases. `tailwind.preset.cjs:1` exports the optional shared Tailwind configuration. Its animation plugin loads only when the preset is actually used, not when using the fallback pass alone. | `test/fix-a-browser.test.tsx`: “ships every animation with an independent consumer Tailwind config” |
| #14 / #15 | `src/theme/tokens.ts:53` / `:190` and mirrored globals theme blocks improve primary hover, descriptions, subtle tones, solid success, shell badge, and input boundaries. Focus indicators already pass the tested surfaces and remain unchanged. | `test/theming.test.ts`: 44 named text/boundary contrast cases across both themes |
| #45 (A files) | `src/components/dialog.tsx:14` and `:70`: Trigger/Close have slots; Header/Footer forward refs and support `asChild`. `src/components/text.tsx:27`, `:46`, `:65`: Text/Heading/SectionLabel support `asChild`, refs and merged classes. | `test/fix-a-parts.test.tsx`: “text and dialog structural parts compose slots, classes and refs through asChild”; “dialog action parts expose slots and forward refs” |

The Theming section in `docs/primitives/README.md` and `docs/primitives/theme.md` describes tiers, nesting, semantic rebinding, the exact-name escape hatch, private geometry, layers, portable animations, and required PostCSS setup.

## Contrast before / after

Ratios are computed from the pre-fix snapshot and current `tokens.ts`, resolving their aliases and using WCAG relative luminance. New intermediate Flexoki steps were checked against the [upstream palette](https://raw.githubusercontent.com/kepano/flexoki/main/css/flexoki.css). Existing palette values remain unchanged. Light warning uses the existing darker 800 step because 700 still fails 4.5:1. Dark info/danger use adjacent 300 steps rather than jumping to 200.

| Pair (`--onyx-` prefix omitted) | Required | Dark before → after | Light before → after |
|---|---:|---:|---:|
| control-button-fg / control-button-bg | 4.5 | 6.36 → 6.36 | 6.36 → 6.36 |
| control-button-fg / control-button-hover-bg | 4.5 | 3.83 → 4.94 | 3.83 → 4.94 |
| text-description / surface-panel | 4.5 | 4.67 → 6.34 | 4.47 → 6.42 |
| text-description / surface-raised | 4.5 | 4.04 → 5.49 | 4.97 → 7.14 |
| shell-badge-fg / shell-badge-bg | 4.5 | 4.86 → 4.86 | 3.83 → 6.36 |
| tone-neutral-fg / tone-neutral-bg | 4.5 | 7.26 → 7.26 | 4.47 → 6.42 |
| tone-neutral-solid-fg / tone-neutral-solid | 4.5 | 7.14 → 7.14 | 7.14 → 7.14 |
| tone-info-fg / tone-info-bg | 4.5 | 4.47 → 6.21 | 5.42 → 5.42 |
| tone-info-solid-fg / tone-info-solid | 4.5 | 6.36 → 6.36 | 6.36 → 6.36 |
| tone-success-fg / tone-success-bg | 4.5 | 5.43 → 5.43 | 3.81 → 5.23 |
| tone-success-solid-fg / tone-success-solid | 4.5 | 4.39 → 6.03 | 4.39 → 6.03 |
| tone-warning-fg / tone-warning-bg | 4.5 | 7.01 → 7.01 | 3.01 → 8.31 |
| tone-warning-solid-fg / tone-warning-solid | 4.5 | 5.49 → 5.49 | 5.49 → 5.49 |
| tone-danger-fg / tone-danger-bg | 4.5 | 4.09 → 5.84 | 5.18 → 5.18 |
| tone-danger-solid-fg / tone-danger-solid | 4.5 | 6.23 → 6.23 | 6.23 → 6.23 |
| control-input-border / control-input-bg | 3 | 1.62 → 4.67 | 1.39 → 3.59 |
| control-focus-ring / surface-app | 3 | 4.86 → 4.86 | 6.36 → 6.36 |
| control-focus-ring / surface-panel | 3 | 4.37 → 4.37 | 5.72 → 5.72 |
| control-focus-ring / surface-raised | 3 | 3.79 → 3.79 | 6.36 → 6.36 |
| control-focus-ring / surface-dialog | 3 | 4.37 → 4.37 | 6.36 → 6.36 |
| control-focus-ring / surface-menu | 3 | 4.37 → 4.37 | 6.36 → 6.36 |
| control-focus-ring / control-input-bg | 3 | 4.37 → 4.37 | 6.36 → 6.36 |

## Browser proof and visual checks

The real headless Chromium shell at `~/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell` verified:

- Outer component overrides persist through nested light + comfortable + theme-root boundaries: button radius **17px**, input height **43px**.
- The same input without a component override resolves comfortable height **36px**.
- A root with variables but no explicit theme resolves palette override → button background **#A02F6F**, panel override → sidebar and shell tabs **#112233**.
- Independently overridden inherited aliases stay **orange** / **lime**, and an explicit root alias stays **purple**.
- Unlayered `[data-slot="checkbox"] { background: red }` yields **rgb(255, 0, 0)** even when checked.
- Recursive CSSOM inspection finds **0 unlayered Onyx style rules**, including rules in media/scope/container blocks.
- An independent consumer Tailwind config retains shimmer, accordion and animate-in animation names and all required keyframes.

The automated browser regression builds scratch CSS itself. A separate `/tmp/onyx-a-probe.html` also linked the actual processed `gallery/onyx.css` and produced the same override/rebinding/checkbox/CSSOM results.

Gallery screenshots at 1280×1200 show the theming samples and tone table. The stronger input outlines, readable descriptions, darker success solid, and adjusted subtle tones retain the Flexoki appearance:

- `gallery/screenshots/fix-a-dark-compact-1280.png`
- `gallery/screenshots/fix-a-light-comfortable-1280.png`

Both captures were inspected. These are viewport captures of the theme/foundations area, not full-page captures. Browser logs include the gallery's existing Radix Tooltip controlled/uncontrolled warning; no screenshot check was blocked by it.

## Verification

- `bun run typecheck`: **pass** on the final run. Earlier transient errors in concurrently edited forms files cleared without A editing them.
- `bun test`: **269 pass, 2 fail**, 271 tests / 28 files. Both failures are `src/registry.test.ts`: dependency metadata and complete import closure; registry sync is B/orchestrator work. All other tests pass.
- A's four test files: **55 pass, 0 fail**, including real Chromium regression tests. Browser tests skip outside installations with the specified headless shell; they ran here.
- `bun run build:css`: **command succeeds**, but currently omits `--postcss`, so it does not execute the required fallback pass for still-unmodified component reads. A separately ran `bunx tailwindcss --postcss -c tailwind.config.cjs -i src/styles.css -o gallery/onyx.css` successfully before browser checks/screenshots and left that processed artifact in place.

## Not finished / integration limitations

No assigned source fix remains unimplemented. **#7 is not end-to-end complete in the standard build until the two `--postcss` requests below are applied.** The running gallery watcher also needs this flag; otherwise it can overwrite corrected generated CSS after another source edit.

Semantic rebinding depends on browser support for `@scope` and custom-property container style queries. This is documented and verified in real Chromium. No older-browser fallback or real-device/screen-reader run was added.

## Shared-file requests

1. **B — `package.json`:** add `--postcss` to `build:css`. Exact command: `tailwindcss --postcss -c tailwind.config.cjs -i src/styles.css -o gallery/onyx.css && bun gallery/copy-assets.ts`.
2. **Orchestrator — `gallery/server.ts`:** add `--postcss` to the Tailwind watcher arguments. This is outside A's ownership.
3. **B — export/registry:** export `./tailwind.preset.cjs` → `./tailwind.preset.cjs` from `package.json` and ship that file with the theme registry item. It includes the optional Tailwind preset and the required `onyxPostcss()` source-build pass. Keep the preset at the same path as its documented local registry import, or adjust copied consumer setup consistently.
4. **B — dependencies/registry:** add `postcss-import` explicitly to dev dependencies (currently available transitively from Tailwind) and theme registry/setup guidance, with PostCSS and Tailwind. Plugin order: import expansion → Tailwind → autoprefixer → `onyxPostcss()`. Consumers using the optional Tailwind preset also need `tailwindcss-animate`; the fallback pass alone does not load it.
5. **B — dialog registry:** A added a runtime `@radix-ui/react-slot` import to `src/components/dialog.tsx`; the package already has it, but the dialog registry item must include it after sync. `src/components/theme.tsx` imports the new dependency helper from its existing `src/theme/tokens.ts` dependency. New token/helper exports flow through the existing wildcard theme exports; no `src/index.ts` edit is needed.
6. **B/orchestrator:** run `bun run registry:sync`, then repeat typecheck/tests/build and the browser regressions after the shared changes.
