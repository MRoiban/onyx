# Theme

**Use when:** Scope an Onyx theme or density, or override tokens. **Not for:** Application state management or portal focus/dismissal.

## Anatomy and props

`theme-root` forwards its ref, merges `className`, and accepts `asChild`. `theme`: dark/light; `density`: compact/comfortable; `variables`: registered camelCase keys or exact CSS names, plus the typed `--onyx-${string}` escape hatch; compatibility `themeClass`; ordinary DOM attributes and `style`. Attributes: `data-slot`, `data-theme`, `data-density`, `data-theme-variant`, `data-onyx-theme-root`. Omitted theme/density inherit from CSS ancestors. `style` takes precedence over `variables` on the same root.

## Consumer setup

Import the supplied styles and include the copied Onyx source in Tailwind's `content`. No extra PostCSS step is needed: every component-token read in Onyx source carries its own fallback (`var(--onyx-button-radius,var(--onyx-radius-md))`), so defaults resolve where they're used and ancestor overrides survive nested theme or density boundaries. When you write your own utilities against component tokens, include the same fallback.

The optional Tailwind preset (`presets: [require('@onyx/ui/tailwind.preset.cjs')]`; it isn't part of the registry, so copy it alongside registry source if you want it) exposes Onyx animation names for your own utilities; install `tailwindcss-animate` when using it. Existing primitive animations ship directly in layered CSS and don't need the preset.

Keep `@tailwind utilities;` **and** `@tailwind variants;` inside `@layer onyx.components` when supplying your own entry stylesheet. The provided stylesheet already does so. All Onyx CSS is layered; an unlayered consumer `[data-slot="checkbox"] { background: red; }` beats a checked utility.

## Override tiers and nesting

- Palette: `--onyx-palette-*` Flexoki ramps.
- Semantic: surfaces, text, borders, controls, tones, space/type, motion, focus and layer tokens. An explicit theme or density boundary supplies that tier's defaults.
- Component: individual primitive adjustments such as `--onyx-button-radius`, `--onyx-card-bg`, `--onyx-slider-thumb-size`. Defaults resolve against the nearest semantic tokens at the declaration that uses them. Component defaults are never redeclared on theme roots or theme/density boundaries.

An ancestor component override survives arbitrarily nested roots, including changes of theme and density. Without an override, a comfortable input derives its height from the comfortable control-height token. A closer explicit component override wins through ordinary CSS inheritance. `className`, `style`, and unlayered `data-slot` rules can customize the rendered parts.

```tsx
<OnyxThemeRoot variables={{ buttonRadius: '999px', inputHeight: '3rem' }}>
  <OnyxThemeRoot theme="light" density="comfortable">
    {/* Radius and input height still use the ancestor overrides. */}
  </OnyxThemeRoot>
</OnyxThemeRoot>
```

`variables` emits only explicit inline overrides. It also requests re-declaration of the dependent semantic aliases, without requiring an explicit theme. For example, `paletteBlue600` rebinds `controlButtonBg`, and `surfacePanel` rebinds `surfaceSidebar`, `shellTabsBg` and `shellToolbarBg`. An explicit alias override on that root wins; an independently overridden inherited alias remains intact. Unaffected tokens inherit normally. Alias rebinding uses CSS `@scope` to select the nearest theme and custom-property style queries to distinguish inherited defaults from consumer overrides, requiring browser support for these features. A plain CSS palette override should be placed on an explicit theme boundary so its aliases resolve there.


Automatic semantic rebinding requires both [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@scope) and [custom-property container style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_size_and_style_queries): Chromium **118+**; Firefox **146+** for `@scope` and **151+** for style queries (both are needed); Safari **18+**, with caveats. Safari cannot use the document element as a style-query container, so root-level rebinding may require a wrapper; Safari 26–26.3 also has a scoped-rule bug affecting inputs and textareas (fixed in 26.4). See the [scope compatibility data](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/scope.json) and [style-query compatibility data](https://github.com/mdn/browser-compat-data/blob/main/css/at-rules/container.json).

Without support for either feature, derived aliases keep their inherited values even when `variables` changes their dependencies. Pass an explicit `theme` to re-derive the theme aliases at that boundary: `<OnyxThemeRoot theme="light" variables={{ paletteBlue600: '#A02F6F' }}>…</OnyxThemeRoot>`. This fallback also redeclares the other semantic defaults for that theme; repeat any desired semantic overrides on the boundary.

Body portals inherit `<html>` rather than the local root. Synchronize document theme/density or use the primitive's supported portal container when appropriate.

## Public and private variables

`ONYX_THEME_VARIABLES` registers the public tokens read by primitive CSS/TSX. `OnyxThemeVariables` also accepts exact `--onyx-${string}` names for new consumer tokens. Private variables carry per-instance geometry or rendering state: resolved font size, tree depth/row geometry, split geometry, toast index, color-picker hue/gradient endpoints, and the internal `--onyx-display-*` tone aliases. They are listed in `ONYX_PRIVATE_VARIABLES`; the escape hatch does not make them stable public APIs.

The existing exports remain: `ONYX_PALETTE`, `ONYX_SEMANTIC_DARK`, `ONYX_SEMANTIC_LIGHT`, `ONYX_COMPONENT_TOKENS`, `ONYX_DENSITY_COMPACT`, `ONYX_DENSITY_COMFORTABLE`, `ONYX_DEFAULT_THEME`, `ONYX_THEME_VARIABLES`, `mergeOnyxThemeVariables`, and `createOnyxThemeStyleMap`. Existing shell/state/scale names remain supported. `getOnyxThemeRebindings` is the internal dependency helper used by `OnyxThemeRoot`.
