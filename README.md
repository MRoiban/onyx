# Onyx UI

`@onyx/ui` is the source-owned React primitive layer for Babel and future workbench-style apps.

It follows a shadcn-style package contract:

- source-owned components
- semantic CSS variables
- composition-friendly refs and `className`
- Radix-backed behavior where accessibility and portal/state handling matter
- codicon-first iconography through the exported `Icon` primitive

## Package use

Import the shared stylesheet once at your app entrypoint:

```tsx
import '@onyx/ui/styles.css';
```

Then import primitives from subpath exports:

```tsx
import { Button } from '@onyx/ui/button';
import { Dialog, DialogContent } from '@onyx/ui/dialog';
import { OnyxThemeRoot } from '@onyx/ui/theme';
```

## Registry use

`onyx/registry.json` lists each public primitive as a shadcn-style registry item.

Registry consumers should copy the referenced source files into their app and keep the required package dependencies aligned with the registry item metadata.

## Theme contract

Onyx is app-agnostic. Its public theme API is the semantic `--onyx-*` token surface, not Babel-specific variables.

Key token groups:

- `--onyx-surface-*`
- `--onyx-text-*`
- `--onyx-control-*`
- `--onyx-state-*`
- `--onyx-shell-*`
- `--onyx-radius-*`
- `--onyx-shadow-*`
- `--onyx-z-*`
- `--onyx-scale-*`
- `--onyx-font-*`

Use `OnyxThemeRoot` from `@onyx/ui/theme` to scope overrides, or apply the same semantic variables at an app root.

## Codicons

Onyx styles import `@vscode/codicons/dist/codicon.css`, and the exported `Icon` component wraps codicon names so downstream components do not need raw `<i class="codicon ...">` markup.

## Public exports

- `@onyx/ui/styles.css`
- `@onyx/ui/button`
- `@onyx/ui/checkbox`
- `@onyx/ui/input`
- `@onyx/ui/textarea`
- `@onyx/ui/switch`
- `@onyx/ui/progress`
- `@onyx/ui/number-effect`
- `@onyx/ui/select`
- `@onyx/ui/section-select`
- `@onyx/ui/dialog`
- `@onyx/ui/context-menu`
- `@onyx/ui/command`
- `@onyx/ui/table`
- `@onyx/ui/kbd`
- `@onyx/ui/sidebar`
- `@onyx/ui/panel`
- `@onyx/ui/tabs`
- `@onyx/ui/toolbar`
- `@onyx/ui/status-bar`
- `@onyx/ui/empty-state`
- `@onyx/ui/text`
- `@onyx/ui/toast`
- `@onyx/ui/icon`
- `@onyx/ui/theme`
