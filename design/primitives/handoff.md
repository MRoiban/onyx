# Onyx primitives expansion: handoff

```text
Design artifact: design/primitives/mockup.html  (sha256 9b6a3806…12129, branch feat/primitives-expansion)
Design status: selected (design owner: orchestrator). Not yet user-approved.
Preview: python3 -m http.server 4815 -d design/primitives → http://localhost:4815/mockup.html?theme=dark|light&density=compact|comfortable
```

The mockup is the **visual source of truth**. Its `<style>` block holds the exact token
names, values and per-part geometry. If you think a visual change is needed (for a11y,
platform limits, or a clear inconsistency), say so with a reason in your final report.
Don't silently diverge. Visual decisions belong to the orchestrator.

## Philosophy (non-negotiable)

Onyx is **opinionated by default and fully controllable afterwards**. The defaults should
look finished, but a consumer can rebuild the look completely without forking a component.

1. **Three token tiers.**
   - `--onyx-palette-*`: raw Flexoki ramps.
   - `--onyx-*` semantic tokens: the public API.
   - `--onyx-<component>-*` component tokens: each defaults to a semantic token.

   Components read **only** semantic and component tokens. Never use raw hex or px in
   component code, except for 1px hairlines.
2. **Styling hooks on every part.**
   - `data-slot="<component>-<part>"`.
   - State attributes: `data-state`, `data-disabled`, `data-invalid`, `data-highlighted`,
     `data-orientation`, `data-side`.
   - Variant attributes: `data-variant`, `data-size`, `data-tone`.
3. **Composition.**
   - Every part forwards its ref and merges `className` through `cn()`.
   - Parts that render a single element accept `asChild` (Radix Slot).
   - Every component exports its `cva` variants function.
4. **Headless behaviour.** Any non-trivial behaviour is also exported as a hook, so
   consumers can supply their own markup. Examples: `useListbox`, `useTree`,
   `useResizable`, `useVirtualList`, `useControllableState`, `useRovingFocus`,
   `useFieldControl`, `useToast`.
5. **Cascade layers.** Onyx's own CSS lives in `@layer onyx.base, onyx.components` so
   app CSS wins without `!important`.
6. **Accessibility.** Follow WAI-ARIA APG patterns: full keyboard support, visible focus,
   honour `prefers-reduced-motion`.
7. **Density and theme switch from any ancestor.** `data-density="compact|comfortable"`
   and `data-theme="dark|light"` must work on any ancestor, not only `:root`.
   - Compact is the default (workbench).
   - Comfortable is for web pebbles.
   - Body portals inherit from `:root`.
   - `OnyxThemeRoot` accepts `theme`, `density` and `variables` (any tier).

## Visual requirements

Use the token values in the mockup's `:root` / `.onyx` / `[data-theme=light]` / `[data-density=comfortable]` blocks exactly.

**Token groups to add:**
- **Borders:** `border-{subtle,default,strong}`.
- **Surfaces:** `surface-raised`, `surface-tooltip`.
- **Controls:** `control-track`.
- **Tones:** `tone-{neutral,info,success,warning,danger}-{fg,bg,border,solid,solid-fg}`.
- **Radii:** `radius-{xs,sm,md,lg,full}`.
- **Spacing:** `space-{0-5,1,1-5,2,3,4,5,6,8,10}`.
- **Type:** `text-{xs,sm,md,lg,xl,2xl}`, `leading-*`, `weight-*`, `font-mono`.
- **Sizing:** `control-height-{xs,sm,md,lg}`, `row-height`.
- **Motion:** `duration-{fast,normal,slow}`, `ease-{standard,emphasized,exit}`.
- **Focus:** `focus-ring-{width,offset}`.
- **Layers:** `z-{tooltip,toast}`.
- **State:** `state-selected-inactive`.

**Rules for existing tokens:**
- Keep every existing token as a working alias. `shell-*`, `state-warning/error/success`
  and `scale-ui` stay as they are.
- Generic borders move from `--onyx-shell-tabs-border` to `--onyx-border-default`.

**Geometry:**
- Menu and list rows use `--onyx-menu-item-height` / `--onyx-row-height`.
- Floating surfaces use: `surface-menu`, a `border-default` border, `shadow-md`,
  `radius-md`, and a 4px inner padding for menus.
- Focus ring: 2px `control-focus-ring` with a 1px offset. Inputs show an inset 1px ring
  plus a border colour change.

## Responsive and state requirements

- **Widths:** 1280 and 390 (see the mockup at both). Floating content must collide-flip
  and stay within the viewport (8px padding). Dialogs and sheets must fit 390px.
- **States per primitive:** exactly those shown in the mockup cells, for example:
  - Button: loading/pressed/disabled.
  - Input and InputGroup: invalid/disabled.
  - Tree: selected/focused/drop-target/renaming.
  - DropZone: idle/over/invalid.
  - ResizeHandle: hover/dragging.
  - Toast: stacked.
- **Mode coverage:** all four combinations of dark/light × compact/comfortable.

## Integration targets (inspected)

- `src/components/*.tsx` + `src/<name>.ts` subpath shims + `src/index.ts` + `package.json#exports` + `registry.json` items (shadcn schema: name, type, files, dependencies, registryDependencies).
- `src/theme/tokens.ts` (`ONYX_THEME_VARIABLES`, `ONYX_DEFAULT_THEME`), `src/styles/globals.css`, `src/components/theme.tsx`.
- Existing conventions: Tailwind 3 arbitrary values with `calc(Npx*var(--onyx-scale-ui))`, `cva`, `cn` (clsx + tailwind-merge), Radix, codicons via `Icon`.
- Repo currently is **not runnable standalone**: no node_modules, `postcss.config.cjs` requires a non-existent `../new-ui/tailwind.config.cjs`, tsconfig lists `vite/client`.
- Consumers (do not edit them; for awareness): Babel (`/Users/stellar/Playground/babel-ui`) and Bedrock `@bedrock/ui` (`/Users/stellar/Playground/bedrock/packages/ui`) vendor Onyx through registry sync; keep the registry shape compatible.

## Simulations to replace

The mockup's demo values are static. Implementations must have real behaviour:
- **Floating elements:** real positioning, collision handling and dismissal.
- **Collections:** real keyboard and selection models.
- **Resizing and drag-and-drop:** real pointer/keyboard resizing and drag/drop events.
- **Toasts:** a real queue with timers that pause on hover/focus.
- **OTP:** paste handling.
- **Color picker:** real HSV maths.
- **Calendar:** real date maths via `Intl`, locale-aware week start.

## Ownership

Parallel agents share this checkout, so stay inside your files. Don't revert or rewrite
another agent's work.

| WS | Owner files | Content |
|---|---|---|
| **W0 Foundations** (runs first, alone) | `package.json`, `bunfig.toml`, `tsconfig.json`, `postcss.config.cjs`, `tailwind.config.cjs`, `registry.json`, `src/index.ts`, `src/<name>.ts` shims, `src/theme/**`, `src/styles/globals.css`, `src/lib/**`, `gallery/**` scaffold, `test/setup.ts`; components: `button`, `input`, `textarea`, `toolbar`, `text` (Code only), `spinner`, `theme`, `kbd`, plus the border-token sweep across **all existing** components | Standalone repo; every dependency for all workstreams installed; tokens; light theme; density; layers; utilities; **pre-register every new module** (stub shim + registry item + export + index re-export + gallery section stub + `src/styles/<ws>.css` imported from globals) |
| **W1 Overlays** | `popover`, `menu` (dropdown), `tooltip`, `truncate`, `hover-card`, `alert-dialog`, `sheet`, `menubar`, `navigation-menu`, `combobox`, `date-picker` (wait for W2's `calendar`; if it's missing, build it last), and the shared menu-item styles extracted from `context-menu` into `src/lib/menu-styles.ts`; `src/styles/overlays.css`; `gallery/sections/overlays.tsx` | |
| **W2 Forms** | `field` (Field, Label, FieldDescription, FieldError, Fieldset, `useFieldControl`), `input-group`, `search-field`, `number-field`, `radio-group`, `checkbox-group`, `slider`, `toggle`, `toggle-group`, `otp-field`, `password-field`, `color-swatch`, `color-picker`, `calendar`, `file-trigger`, `drop-zone`; may edit `input`, `textarea`, `checkbox`, `switch`, `select` **only** to consume field context; `src/styles/forms.css`; `gallery/sections/forms.tsx` | |
| **W3 Collections** | `listbox`, `tree`, `virtual-list`, `scroll-area`, `resize-handle`, `split-view`, `collapsible`, `accordion`, `pagination`, `carousel`; edits `tabs` (line variant), `sidebar` (SidebarRail → ResizeHandle, keyboard resize), `panel` (ListRow/TreeRow become the visual layer for Listbox/Tree), `table` (sortable header affordance); `src/styles/collections.css`; `gallery/sections/collections.tsx` | |
| **W4 Display & layout** | `badge` (Badge, Count, StatusDot), `tag`, `alert`, `card`, `avatar` (+AvatarGroup), `skeleton`, `meter`, `separator`, `link`, `breadcrumb`, `layout` (Stack, Inline, Container, Grid), toast queue (`ToastProvider`, `useToast`, stacking; extend `toast`), `progress` (indeterminate), `empty-state` token cleanup; `src/styles/display.css`; `gallery/sections/display.tsx` | |

**Shared-file rule.**
- Only W0 edits `package.json`, `registry.json`, `src/index.ts`, `globals.css` and
  `tailwind.config.cjs`.
- If W1–W4 need one of those changed (a new dependency, a new registry dependency, a new
  keyframe), they list it under **"Shared-file requests"** in the final report. The
  orchestrator applies it.
- Each workstream fills in its registry item's `dependencies` / `registryDependencies` in
  that report too.

**Dependency choices (W0 installs all of them; agents may argue for alternatives in their report):**
- **Radix packages:** popover, dropdown-menu, tooltip, hover-card, alert-dialog,
  menubar, navigation-menu, radio-group, slider, toggle, toggle-group, scroll-area,
  avatar, collapsible, accordion, label, visually-hidden, portal, focus-scope.
- **Other libraries:**
  - `@floating-ui/react-dom` for custom anchored elements.
  - `@tanstack/react-virtual` for VirtualList.
  - `tailwindcss-animate`: existing components already use `animate-in` / `fade-in-0`.
- **Built by hand, no library:** Listbox, Tree, ResizeHandle/SplitView, NumberField, OTP,
  Calendar (`Intl`), ColorPicker (HSV), Carousel (scroll-snap), Toast queue,
  Field context.

## Acceptance

**Visual checks (orchestrator):**
- `bun run gallery` serves `gallery/` at **http://localhost:4816**. Its sections mirror
  the mockup's sections 0–7, with the same demo content and states.
- Each section renders real components.
- Theme and density toggles in the gallery header work.
- The orchestrator compares gallery screenshots against the mockup at 1280 and 390.

**Integration checks (every workstream):**
- `bun run typecheck` and `bun test` pass.
- Tests cover keyboard models and ARIA wiring, using happy-dom and
  @testing-library/react.
- Includes `src/registry.test.ts`.

**Token discipline:**
- W0 adds `test/tokens.test.ts`. It fails if any `src/components/*.tsx` contains a raw
  hex colour, or a `--onyx-shell-tabs-border` used for a generic border.

**Docs:**
- Each new primitive gets a section in `docs/primitives.md` with:
  - A **"Use when / Not for"** line.
  - **Anatomy:** its slots.
  - **Props and data attributes.**
  - **Tokens:** which component tokens it reads.
  - **Headless hook:** if it has one.
- Each section is written by the owning workstream as `docs/primitives/<name>.md`; W0
  creates `docs/primitives/README.md` as the index.

**Open assumptions:**
- `IBM Plex Sans` / `Lilex` remain app-provided; the defaults stay system fonts.
- Gemstone patterns (file explorer, settings rows, command service, confirm service) are
  out of scope.
- Consumer migrations (Babel, Bedrock) are out of scope.

## Integration decisions (orchestrator, after W0–W4)

Accepted deviations from the mockup, each with its reason:
- **Real overlays.** They portal to the body, so some extend past their gallery cell. Radix draws a triangular arrow instead of the mockup's diamond.
- **Tooltip colours.** The tooltip uses semantic tokens rather than raw palette steps, so its text is slightly brighter.
- **Transient states.** ResizeHandle hover/drag highlights, focus rings and scroll shadows appear only on real interaction. They are not forced on statically.
- **Real data.** The calendar shows the full month and the actual "today". Slider, colour and toast-timer positions follow real values.
- **DatePicker trigger.** The trigger is a trailing button inside the field, not a decorative leading icon. Range values display localized via `Intl.DateTimeFormat#formatRange`, e.g. "6 – 10 Oct 2026".
- **Layout demo.** The demo form omits the mockup's dashed annotation outlines, because it uses no app CSS at all.

Library fixes made during integration:
- **Registry metadata is derived from code.** `scripts/sync-registry.ts` (`bun run registry:sync`) computes each item's dependencies from its actual imports, and `src/registry.test.ts` fails when the registry is stale. This also registered `sidebar-environment.ts` and `section-select-environment.ts`, which were previously missing from the registry.
- **Codicon layering.**
  - `codicon.css` is now imported into `@layer onyx.base`. Before, its unlayered 16px rule overrode every contextual icon size.
  - `Icon` has no default size: it uses codicon's 16px unless `size` or a component rule sets one.
- **Checkbox indicators.** Checkbox now renders a `span[data-slot=checkbox-root]` wrapper with check and dash indicators (`data-slot=checkbox-indicator`). Before, the checked state showed only colour and indeterminate showed nothing. The ref, className and props stay on the `<input>`.
- **NumberField.** The stepper column is a two-row grid, so the chevrons no longer clip.
- **TypeScript target.** `tsconfig` lib is raised to ES2022 for `Intl.DateTimeFormat#formatRange`.
- **Gallery order.** Gallery sections follow the mockup order. Feedback hosts W3's Pagination·Carousel cell.

Verified:
- `bun run typecheck` passes.
- `bun test`: 120 pass, 0 fail.
- `bun run registry:sync --check` is clean.
- Gallery screenshots at 1280 and 390 match the mockup in dark/compact and light/comfortable.

Not verified:
- Real screen-reader passes.
- Touch and swipe on devices.
- Consumer builds: Babel and Bedrock have not been re-synced.
