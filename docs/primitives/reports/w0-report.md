# W0 Foundations implementation report

All work is uncommitted on `feat/primitives-expansion`. Babel and Bedrock were read only; no consumer repositories were edited.

## Result

Standalone Bun 1.4.2 library, complete three-tier token contract, W0 components and shared headless utilities, all 49 primitive modules registered, real foundation gallery, tests and documentation. W1–W4 component stubs remain intentionally empty.

## Run and validation

```sh
bun install
bun run gallery  # http://localhost:4816
bun run build:css
bun run typecheck
bun test
```

Typecheck passed. CSS build passed. `git diff --check` passed. Test summary:

```text
49 pass
0 fail
1098 expect() calls
Ran 49 tests across 16 files. [191.00ms]
```

Existing tests use Vitest imports and are run through Bun's compatible test runner. Happy-dom is preloaded from `test/setup.ts`; Testing Library cleanup runs after each test. The Button icon test was updated from fixed 36px geometry to the new density token contract.

## Tokens

- Palette: 42 Flexoki variables.
- Semantic: 131 variables defined in both dark and light maps, including retained aliases.
- Component: 24 defaults, including all mockup component tokens plus Spinner, Code, Kbd and Textarea geometry.
- Comfortable density overrides 8 sizing/type variables; compact defaults remain 20/24/28/32px, comfortable 24/30/36/40px.
- New groups: borders, raised/tooltip surfaces, control track, five complete tone sets, radii, spacing, type/leading/weight/mono, control and row heights, motion/easing, focus geometry, inactive selection, tooltip/toast z layers.
- All original camelCase theme keys and CSS variable names remain. Generic shell-tabs-border usages were swept; two actual tab-chrome usages remain in tabs.tsx. No raw component hex colors were present.
- Theme and density rules are independent; a nested theme boundary inherits the outer density. Explicit inline variables win over CSS defaults. Palette replacements should be applied at a theme boundary, e.g. provide `theme` when using palette overrides on OnyxThemeRoot.

## Visual verification

Compared with the mockup in the T3 browser at 1280px and 390px, dark/compact and light/comfortable. Also checked the other two theme/density combinations, nested comfortable density with a light child theme, pressed styling, and header theme switching. No horizontal overflow at 390px.

At 1280px, section 0–2 vertical positions and heights match the reference. At 390px, sections 0–1 and the two W0 action cell positions/heights match. The remaining action cells and sections 3–7 are placeholders until their owners implement them, so subsequent sections differ in vertical position. Spinners were captured at arbitrary animation phases. Body portals use the HTML theme/density attributes, synchronized by the gallery.

Screenshots (desktop: 1280×2300; narrow: 390×3840):

- [gallery1280dark.png](../../gallery/screenshots/gallery1280dark.png)
- [gallery1280light.png](../../gallery/screenshots/gallery1280light.png)
- [gallery390dark.png](../../gallery/screenshots/gallery390dark.png)
- [gallery390light.png](../../gallery/screenshots/gallery390light.png)
- [mock1280dark.png](../../gallery/screenshots/mock1280dark.png)
- [mock1280light.png](../../gallery/screenshots/mock1280light.png)
- [mock390dark.png](../../gallery/screenshots/mock390dark.png)
- [mock390light.png](../../gallery/screenshots/mock390light.png)

## W1–W4 handoff

- Import utilities from `@onyx/ui/hooks` or root: `useControllableState`, `useRovingFocus`, `composeRefs`, `useComposedRefs`, `useFloatingPosition`. Direct source files use kebab-case names under `src/lib/`.
- `useControllableState({value, defaultValue, onChange})` → `[value, setter]`; setter accepts a functional updater.
- `useRovingFocus({orientation, loop, dir, selector})` → `{ref, onKeyDown, onFocusCapture, refresh, getItems}`. Attach all three root bindings; orientation is horizontal/vertical/both, loop defaults true. Disabled/hidden/inert items are skipped; native text editing keys are retained.
- `useFloatingPosition({open, placement, offset, matchWidth, arrowRef})` → Floating UI refs/styles/update/middleware data. Default bottom-start, offset 4px, flip/shift/size with 8px collision padding, autoUpdate and optional arrow. Dismissal and ARIA/focus behavior are owned by the component.
- `Portal` and `VisuallyHidden` are Radix re-exports at root and `./portal`/`./visually-hidden`.
- CSS files `src/styles/{overlays,forms,collections,display}.css` are imported already. Put all owned rules inside `@layer onyx.components`. Layer order is declared before imports. Consumer utilities can override W0 defaults, which use :where selectors; state colors use cva ARIA/data utility variants.
- Gallery section files each default-export their section component. W2 also owns named `FormsActions`; W4 owns named `DisplayActions`, which the scaffold renders inside section 2. W4's default export contains separate sections 6 and 7.
- Tailwind keyframes and classes: `onyx-spin`, `onyx-shimmer`, `onyx-pulse`, `onyx-indeterminate`, `onyx-toast-enter`, `onyx-toast-exit`; `accordion-open`, `accordion-close`, `collapsible-open`, `collapsible-close`. Compatibility aliases: accordion/collapsible down/up and toast-enter/exit. Prefix all names with `animate-` to use their classes. Spin uses Spinner duration; shimmer/pulse/indeterminate loop at 1.5s; disclosure/toast animations use motion tokens. tailwindcss-animate also supplies animate-in/out, fade-in/out and slide/zoom utilities.
- Button defaults to md, supports default alias and native; loading freezes its previously measured width and prevents actions, including asChild handlers. Initial loading sizes naturally. The label remains accessible; at very small frozen widths it can clip to fit the spinner. Explicit consumer width overrides the measurement.
- Every requested new module has a component stub, shim, package export, index re-export and registry entry. Best-guess runtime/registry dependencies are prefilled; list corrections as shared-file requests. Theme registry files include all four imported workstream styles, and hooks registry files include cn.
- `gallery/onyx.css` and `gallery/codicon.ttf` are generated build assets; build:css regenerates both. node_modules is also generated. This repository has no .gitignore, so the orchestrator should exclude these generated files before committing. No files were committed.

## Installed versions

Runtime dependencies (resolved by bun.lock):

- `@radix-ui/react-context-menu`: `2.3.8`
- `@radix-ui/react-dialog`: `1.2.0`
- `@radix-ui/react-select`: `2.3.8`
- `@radix-ui/react-slot`: `1.4.0`
- `@vscode/codicons`: `0.0.38`
- `class-variance-authority`: `0.7.1`
- `clsx`: `2.1.1`
- `cmdk`: `1.1.1`
- `tailwind-merge`: `3.7.0`
- `@radix-ui/react-popover`: `1.2.0`
- `@radix-ui/react-dropdown-menu`: `2.1.25`
- `@radix-ui/react-tooltip`: `1.3.0`
- `@radix-ui/react-hover-card`: `1.1.24`
- `@radix-ui/react-alert-dialog`: `1.1.24`
- `@radix-ui/react-menubar`: `1.1.25`
- `@radix-ui/react-navigation-menu`: `1.3.0`
- `@radix-ui/react-radio-group`: `1.4.8`
- `@radix-ui/react-slider`: `1.5.0`
- `@radix-ui/react-toggle`: `1.1.19`
- `@radix-ui/react-toggle-group`: `1.1.20`
- `@radix-ui/react-scroll-area`: `1.3.0`
- `@radix-ui/react-avatar`: `1.2.7`
- `@radix-ui/react-collapsible`: `1.1.21`
- `@radix-ui/react-accordion`: `1.2.21`
- `@radix-ui/react-label`: `2.1.16`
- `@radix-ui/react-visually-hidden`: `1.2.12`
- `@radix-ui/react-portal`: `1.1.18`
- `@radix-ui/react-focus-scope`: `1.2.0`
- `@floating-ui/react-dom`: `2.1.9`
- `@tanstack/react-virtual`: `3.14.14`

Development dependencies:

- `typescript`: `7.0.2`
- `@types/react`: `19.3.0`
- `@types/react-dom`: `19.3.0`
- `@types/bun`: `1.4.2`
- `react`: `19.3.0`
- `react-dom`: `19.3.0`
- `postcss`: `8.5.29`
- `autoprefixer`: `10.6.1`
- `tailwindcss-animate`: `1.0.7`
- `happy-dom`: `20.14.6`
- `@happy-dom/global-registrator`: `20.14.6`
- `@testing-library/react`: `16.3.3`
- `@testing-library/user-event`: `14.6.7`
- `vitest`: `5.0.3`
- `tailwindcss`: `3.4.19`

Prettier 3.6.2 was run transiently through bunx for W0 files; it was not added to the manifest.

## Files changed

Tracked source/config files:

- `package.json`
- `postcss.config.cjs`
- `registry.json`
- `src/components/button.test.ts`
- `src/components/button.tsx`
- `src/components/command.tsx`
- `src/components/context-menu.tsx`
- `src/components/dialog.tsx`
- `src/components/empty-state.tsx`
- `src/components/input.tsx`
- `src/components/kbd.tsx`
- `src/components/panel.tsx`
- `src/components/prompt.tsx`
- `src/components/section-select.tsx`
- `src/components/select.tsx`
- `src/components/sidebar.tsx`
- `src/components/table.tsx`
- `src/components/text.tsx`
- `src/components/textarea.tsx`
- `src/components/theme.tsx`
- `src/components/toolbar.tsx`
- `src/index.ts`
- `src/styles/globals.css`
- `src/theme/tokens.ts`
- `tsconfig.json`

New files (generated node_modules and the pre-existing design artifacts excluded):

- `bun.lock`
- `bunfig.toml`
- `docs/primitives/README.md`
- `docs/primitives/button.md`
- `docs/primitives/code.md`
- `docs/primitives/input.md`
- `docs/primitives/kbd.md`
- `docs/primitives/spinner.md`
- `docs/primitives/theme.md`
- `docs/primitives/toolbar.md`
- `gallery/app.tsx`
- `gallery/codicon.ttf`
- `gallery/copy-assets.ts`
- `gallery/foundations.tsx`
- `gallery/gallery.css`
- `gallery/index.html`
- `gallery/onyx.css`
- `gallery/screenshots/gallery1280dark.png`
- `gallery/screenshots/gallery1280light.png`
- `gallery/screenshots/gallery390dark.png`
- `gallery/screenshots/gallery390light.png`
- `gallery/screenshots/mock1280dark.png`
- `gallery/screenshots/mock1280light.png`
- `gallery/screenshots/mock390dark.png`
- `gallery/screenshots/mock390light.png`
- `gallery/sections/collections.tsx`
- `gallery/sections/display.tsx`
- `gallery/sections/forms.tsx`
- `gallery/sections/overlays.tsx`
- `gallery/server.ts`
- `src/accordion.ts`
- `src/alert-dialog.ts`
- `src/alert.ts`
- `src/avatar.ts`
- `src/badge.ts`
- `src/breadcrumb.ts`
- `src/calendar.ts`
- `src/card.ts`
- `src/carousel.ts`
- `src/checkbox-group.ts`
- `src/collapsible.ts`
- `src/color-picker.ts`
- `src/color-swatch.ts`
- `src/combobox.ts`
- `src/components/accordion.tsx`
- `src/components/alert-dialog.tsx`
- `src/components/alert.tsx`
- `src/components/avatar.tsx`
- `src/components/badge.tsx`
- `src/components/breadcrumb.tsx`
- `src/components/calendar.tsx`
- `src/components/card.tsx`
- `src/components/carousel.tsx`
- `src/components/checkbox-group.tsx`
- `src/components/collapsible.tsx`
- `src/components/color-picker.tsx`
- `src/components/color-swatch.tsx`
- `src/components/combobox.tsx`
- `src/components/date-picker.tsx`
- `src/components/drop-zone.tsx`
- `src/components/field.tsx`
- `src/components/file-trigger.tsx`
- `src/components/hover-card.tsx`
- `src/components/input-group.tsx`
- `src/components/layout.tsx`
- `src/components/link.tsx`
- `src/components/listbox.tsx`
- `src/components/menu.tsx`
- `src/components/menubar.tsx`
- `src/components/meter.tsx`
- `src/components/navigation-menu.tsx`
- `src/components/number-field.tsx`
- `src/components/otp-field.tsx`
- `src/components/pagination.tsx`
- `src/components/password-field.tsx`
- `src/components/popover.tsx`
- `src/components/radio-group.tsx`
- `src/components/resize-handle.tsx`
- `src/components/scroll-area.tsx`
- `src/components/search-field.tsx`
- `src/components/separator.tsx`
- `src/components/sheet.tsx`
- `src/components/skeleton.tsx`
- `src/components/slider.tsx`
- `src/components/spinner.tsx`
- `src/components/split-view.tsx`
- `src/components/tag.tsx`
- `src/components/toggle-group.tsx`
- `src/components/toggle.tsx`
- `src/components/tooltip.tsx`
- `src/components/tree.tsx`
- `src/components/truncate.tsx`
- `src/components/virtual-list.tsx`
- `src/date-picker.ts`
- `src/drop-zone.ts`
- `src/field.ts`
- `src/file-trigger.ts`
- `src/hooks.ts`
- `src/hover-card.ts`
- `src/input-group.ts`
- `src/layout.ts`
- `src/lib/compose-refs.ts`
- `src/lib/use-controllable-state.ts`
- `src/lib/use-floating-position.ts`
- `src/lib/use-roving-focus.ts`
- `src/link.ts`
- `src/listbox.ts`
- `src/menu.ts`
- `src/menubar.ts`
- `src/meter.ts`
- `src/navigation-menu.ts`
- `src/number-field.ts`
- `src/otp-field.ts`
- `src/pagination.ts`
- `src/password-field.ts`
- `src/popover.ts`
- `src/portal.ts`
- `src/radio-group.ts`
- `src/resize-handle.ts`
- `src/scroll-area.ts`
- `src/search-field.ts`
- `src/separator.ts`
- `src/sheet.ts`
- `src/skeleton.ts`
- `src/slider.ts`
- `src/spinner.ts`
- `src/split-view.ts`
- `src/styles/collections.css`
- `src/styles/display.css`
- `src/styles/forms.css`
- `src/styles/overlays.css`
- `src/tag.ts`
- `src/toggle-group.ts`
- `src/toggle.ts`
- `src/tooltip.ts`
- `src/tree.ts`
- `src/truncate.ts`
- `src/virtual-list.ts`
- `src/visually-hidden.ts`
- `tailwind.config.cjs`
- `test/foundations.test.tsx`
- `test/setup.ts`
- `test/tokens.test.ts`
