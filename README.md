# Onyx

Onyx (`@mroiban/onyx`) is a standalone React UI package for Pebbles and other projects. It provides reusable components, accessible interaction patterns, and a shared theme system. Pebbles are its main use case, but Onyx has no Bedrock runtime dependency and can be used in any compatible React application.

The package ships compiled ES modules, type definitions, and a ready-made stylesheet. You can also copy selected primitives as source through its registry. Components provide defaults while exposing refs, `className`, `data-slot` attributes, and semantic CSS variables for application-specific styling.

## Use in a React project

Onyx requires React 19. Each [GitHub release](https://github.com/MRoiban/onyx/releases) attaches a package tarball; install it by URL with any package manager:

```sh
bun add https://github.com/MRoiban/onyx/releases/download/v0.2.0/mroiban-onyx-0.2.0.tgz
# npm install … / pnpm add … take the same URL
```

Import the stylesheet once at your application entrypoint, then import components from the package root or individual subpaths:

```tsx
import '@mroiban/onyx/styles.css';
import { Button } from '@mroiban/onyx/button';
import { OnyxThemeRoot } from '@mroiban/onyx/theme';

export function App() {
  return (
    <OnyxThemeRoot theme="dark" density="comfortable">
      <Button onClick={() => console.log('Saved')}>Save</Button>
    </OnyxThemeRoot>
  );
}
```

`styles.css` is prebuilt: it contains every Onyx style and the embedded Codicon font, so no Tailwind or PostCSS setup is needed. Components carry a `"use client"` directive for frameworks with server components.

To compile the styles yourself instead (for example, to share one Tailwind 3 build with your app), import `@mroiban/onyx/source.css` and add the Onyx source to your Tailwind content list:

```js
// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@mroiban/onyx/src/**/*.{ts,tsx}',
  ],
};
```

The optional `@mroiban/onyx/tailwind.preset.cjs` exposes animation utilities for your own components and requires `tailwindcss-animate`; Onyx's built-in animations already ship in its CSS. See the [theme guide](docs/primitives/theme.md) for the full styling contract, nesting, and portal behavior.

## Use in a Pebble

Bedrock vendors every Onyx primitive into `@bedrock/ui`. Pebbles using that integration import components and its compiled stylesheet through Bedrock:

```tsx
import '@bedrock/ui/styles.css';
import { Button, OnyxThemeRoot } from '@bedrock/ui';
```

Bedrock owns that package on the deployment server. Its Onyx sync records the upstream commit and source hash in `packages/ui/ONYX_VERSION`, then builds the standalone CSS used by Pebbles. Updating Onyx alone does not update a deployed Bedrock server: sync, build, and deploy the Bedrock integration as well.

Onyx remains the upstream package. Projects outside Bedrock can use `@mroiban/onyx` directly.

## Components and utilities

Onyx covers actions and inputs, forms and validation, menus and overlays, feedback and display, collections, navigation, and layout. Examples include Button, Field, Combobox, ColorPicker, Dialog, Toast, Tree, VirtualList, SplitView, and the Stack/Inline/Grid layout primitives.

Workbench hosts can compose Sidebar, docked Panel, StatusBar, and ResizeHandle. ActionMenu opens reusable command menus at a viewport point; AnchoredPopover attaches to an existing application control; OverlayScrollbar adds themed scrolling to a native viewport. `useFixedVirtualList` supports existing scrolling containers and transient reveal requests; tree navigation helpers, literal text highlighting, and shortcut formatting can be used without application dependencies. These primitives own UI interaction while the application owns commands, data, and layout policy.

The [primitive documentation](docs/primitives/README.md) lists the components and explains their anatomy, props, tokens, and available hooks. [`package.json`](package.json) lists all public subpath exports. Shared state, focus, ref, and positioning utilities are available from `@mroiban/onyx/hooks`.

Many interaction primitives use Radix UI; floating positioning uses Floating UI. The `Icon` component wraps Codicons, whose stylesheet and font are included through the Onyx CSS imports.

## Themes and customization

Onyx provides dark and light themes, compact and comfortable densities, and three tiers of CSS tokens:

- Palette tokens (`--onyx-palette-*`) define the colors.
- Semantic tokens describe surfaces, text, controls, spacing, type, motion, and layers.
- Component tokens adjust individual parts, such as `--onyx-button-radius`.

Use `OnyxThemeRoot` to scope a theme, density, or token override. Omitted theme and density props inherit from ancestors. Component overrides also inherit across nested theme roots.

```tsx
<OnyxThemeRoot variables={{ buttonRadius: '999px' }}>
  <OnyxThemeRoot theme="light" density="comfortable">
    <Button>Continue</Button>
  </OnyxThemeRoot>
</OnyxThemeRoot>
```

Library styles live in the `onyx.base` and `onyx.components` cascade layers, so unlayered application CSS can override them. See the [theme guide](docs/primitives/theme.md) for token names, browser requirements for automatic alias rebinding, and portal containers.

## Registry use

[`registry.json`](registry.json) describes the primitives as shadcn-style registry items, including their source files and dependencies. Copy the selected items and their dependency closure into your project, keep package dependencies aligned with the metadata, and include the copied source in your Tailwind content list.

## Development

```sh
bun install
bun run typecheck
bun test
bun scripts/sync-registry.ts --check
```

Run `bun run gallery` to explore the components at `http://localhost:4816`. `bun run build:css` rebuilds the gallery stylesheet and assets.

`bun run build` writes the package to `dist/` (ES modules per subpath, declarations, and the standalone stylesheet); `npm pack` runs it automatically.

### Releasing

Bump `version` in `package.json`, commit, then push a matching tag:

```sh
git tag v0.2.0 && git push origin v0.2.0
```

The release workflow type-checks, tests, builds, and attaches `mroiban-onyx-<version>.tgz` to a GitHub release for that tag. It fails if the tag and `package.json` version differ.
