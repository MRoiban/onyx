# Theme

`OnyxThemeRoot` sets the theme (dark or light), the density (compact or comfortable) and any token overrides for everything inside it. Roots can be nested, and anything you leave unset is inherited from the parent.

**Use when:** setting up Onyx in an app, giving one area a different theme or density, or adjusting tokens (brand color, radius, sizes).
**Not for:** application state, or controlling where portals render and how they handle focus (each overlay has a `container` prop for that).

## Import

```tsx
import '@mroiban/onyx/styles.css';
import { OnyxThemeRoot } from '@mroiban/onyx/theme';
```

## Example

```tsx
// app root
<OnyxThemeRoot theme="dark" density="compact">
  <App />
</OnyxThemeRoot>

// brand and shape overrides that survive nested roots
<OnyxThemeRoot variables={{ paletteBlue600: '#A02F6F', buttonRadius: '999px', inputHeight: '3rem' }}>
  <OnyxThemeRoot theme="light" density="comfortable">
    {/* still pill buttons and 3rem inputs, in the light theme */}
  </OnyxThemeRoot>
</OnyxThemeRoot>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `theme` | `'dark' \| 'light'` | inherited | |
| `density` | `'compact' \| 'comfortable'` | inherited | Compact control heights are 20/24/28/32px; comfortable are 24/30/36/40px. |
| `variables` | `OnyxThemeVariables` | — | Token overrides. Use registered camelCase keys (`buttonRadius`), exact CSS names (`'--onyx-button-radius'`), or any new `--onyx-*` name for your own tokens. |
| `style` | CSS | — | Wins over `variables` on the same root. |
| `themeClass` | `string` | — | Kept for compatibility. |
| `asChild` | `boolean` | `false` | |

**Token data and helpers:** `ONYX_PALETTE`, `ONYX_SEMANTIC_DARK`, `ONYX_SEMANTIC_LIGHT`, `ONYX_COMPONENT_TOKENS`, `ONYX_DENSITY_COMPACT`, `ONYX_DENSITY_COMFORTABLE`, `ONYX_DEFAULT_THEME`, `ONYX_THEME_VARIABLES` (the registry of public tokens), `ONYX_PRIVATE_VARIABLES`, `mergeOnyxThemeVariables` and `createOnyxThemeStyleMap`.

## Token tiers

| Tier | Examples | Notes |
|---|---|---|
| Palette | `--onyx-palette-blue-600` | The raw Flexoki color ramps. |
| Semantic | `--onyx-surface-panel`, `--onyx-text-muted`, `--onyx-control-height-md`, `--onyx-space-4`, `--onyx-z-popover` | Change when you cross a theme or density boundary. |
| Component | `--onyx-button-radius`, `--onyx-card-bg`, `--onyx-slider-thumb-size` | Each defaults to a semantic token, resolved **where it is used**. |

Because component defaults are resolved where they are used, an override on an ancestor applies through any nested theme or density root, and an override closer to the component still wins.

## Behavior contract

**Onyx owns:** the theme and density attributes, turning `variables` into inline custom properties, and re-deriving the dependent semantic tokens when you override a palette or semantic token. For example, `paletteBlue600` updates `controlButtonBg`, and `surfacePanel` updates `surfaceSidebar`, `shellTabsBg` and `shellToolbarBg`.

**You supply:** the root, the overrides, and keeping the theme in sync on `<html>` (see below).

## Setup

1. Import `@mroiban/onyx/styles.css` once, at the app entry. It is prebuilt (all Onyx styles plus the Codicon font) and needs no Tailwind or PostCSS.
2. Import your own app CSS after it; Onyx styles sit in cascade layers, so your rules win.

**Compiling the styles yourself** (only if you want one shared Tailwind 3 build):

1. Import `@mroiban/onyx/source.css` instead of `styles.css`.
2. Add the Onyx source to Tailwind's `content` (`./node_modules/@mroiban/onyx/src/**/*.{ts,tsx}`).
3. When you write your own stylesheet entry, keep `@tailwind utilities;` **and** `@tailwind variants;` inside `@layer onyx.components`. `source.css` already does this.
4. Optional: the preset `presets: [require('@mroiban/onyx/tailwind.preset.cjs')]` exposes Onyx's animation names to your own utilities (it requires `tailwindcss-animate`). Onyx's own animations work without it.

## Anatomy

`theme-root` (`data-theme`, `data-density`, `data-theme-variant`, `data-onyx-theme-root`, `data-onyx-rebind`).

## Gotchas

- **Portals inherit from `<html>`, not from the nearest root.** Menus and dialogs render into `document.body`, so set `data-theme` and `data-density` on `<html>` to match your app root, or pass a `container` inside the root.
- **App CSS wins.** All Onyx CSS sits in cascade layers, so an unlayered rule such as `[data-slot="checkbox"] { … }` overrides Onyx without needing `!important`.
- **Your own utilities should include fallbacks.** When you read component tokens yourself, include the semantic fallback, as Onyx does: `var(--onyx-button-radius, var(--onyx-radius-md))`.
- **Re-deriving tokens needs a modern browser.** It relies on CSS `@scope` and custom-property style queries: Chromium 118+, Firefox 146+ for `@scope` and 151+ for style queries, and Safari 18+ with caveats. Safari can't use `<html>` as a style-query container, so wrap your app in a root; Safari 26–26.3 also has a scoped-rule bug affecting inputs. Without support, set an explicit `theme` on the root that holds the override, which re-declares all semantic defaults there (repeat any semantic overrides you need).
- **Private variables aren't API.** Per-instance values such as tree depth, toast index or color-picker hue are listed in `ONYX_PRIVATE_VARIABLES`. The `--onyx-*` escape hatch doesn't make them stable.
