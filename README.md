# Onyx

Onyx (`@onyx/ui`) is a standalone React UI package for Pebbles and other projects. It provides reusable components, accessible interaction patterns, and a shared theme system. Pebbles are its main use case, but Onyx has no Bedrock runtime dependency and can be used in any compatible React application.

The package ships TypeScript source and CSS. You can import it directly or copy selected primitives through its registry. Components provide defaults while exposing refs, `className`, `data-slot` attributes, and semantic CSS variables for application-specific styling.

## Use in a React project

Onyx requires React 19 and a build pipeline that handles TypeScript source and Tailwind CSS 3. The repository is private; use an authenticated checkout to install the package locally:

```sh
gh repo clone MRoiban/onyx ../onyx
bun add ../onyx
```

Import the stylesheet once at your application entrypoint, then import components from the package root or individual subpaths:

```tsx
import '@onyx/ui/styles.css';
import { Button } from '@onyx/ui/button';
import { OnyxThemeRoot } from '@onyx/ui/theme';

export function App() {
  return (
    <OnyxThemeRoot theme="dark" density="comfortable">
      <Button onClick={() => console.log('Saved')}>Save</Button>
    </OnyxThemeRoot>
  );
}
```

The stylesheet is source CSS, so compile its imports and Tailwind directives in your application's CSS build. Include both your application and the installed Onyx source in the Tailwind content list:

```js
// tailwind.config.cjs
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@onyx/ui/src/**/*.{ts,tsx}',
  ],
};
```

Adjust the paths for your project layout or copied registry files. The optional `@onyx/ui/tailwind.preset.cjs` exposes animation utilities for your own components and requires `tailwindcss-animate`; Onyx's built-in animations already ship in its CSS. See the [theme guide](docs/primitives/theme.md) for the full styling contract, nesting, and portal behavior.

## Use in a Pebble

Bedrock integrates a selected set of Onyx primitives into `@bedrock/ui`. Pebbles using that integration import components and its compiled stylesheet through Bedrock:

```tsx
import '@bedrock/ui/styles.css';
import { Button, OnyxThemeRoot } from '@bedrock/ui';
```

Bedrock owns that package on the deployment server. Its Onyx sync records the upstream commit and source hash in `packages/ui/ONYX_VERSION`, then builds the standalone CSS used by Pebbles. Updating Onyx alone does not update a deployed Bedrock server: sync, build, and deploy the Bedrock integration as well.

Onyx remains the upstream package. Projects outside Bedrock can use `@onyx/ui` directly, and the Bedrock integration exposes only the primitives selected by its registry.

## Components and utilities

Onyx covers actions and inputs, forms and validation, menus and overlays, feedback and display, collections, navigation, and layout. Examples include Button, Field, Combobox, ColorPicker, Dialog, Toast, Tree, VirtualList, SplitView, and the Stack/Inline/Grid layout primitives.

The [primitive documentation](docs/primitives/README.md) lists the components and explains their anatomy, props, tokens, and available hooks. [`package.json`](package.json) lists all public subpath exports. Shared state, focus, ref, and positioning utilities are available from `@onyx/ui/hooks`.

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
