# Icon

Draws a [Codicon](https://microsoft.github.io/vscode-codicons/dist/codicon.html), the VS Code icon set, by name. Onyx components use it internally, and you can use it anywhere.

**Use when:** you need a glyph from the Codicon set.
**Not for:** brand logos or illustrations (use an `<img>` or `<svg>`), or status indicators that carry meaning on their own (pair them with text, or use [Badge · StatusDot](badge.md)).

## Import

```tsx
import { Icon } from '@mroiban/onyx/icon';
```

## Example

```tsx
<Icon name="search" />                                {/* decorative, inherits font size */}
<Icon name="warning" size="sm" className="text-[var(--onyx-tone-warning-fg)]" />
<button aria-label="Close"><Icon name="close" /></button>
<Icon name="lock" decorative={false} label="Private" /> {/* meaningful on its own */}
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | `string` | — | **Required.** A Codicon name such as `"chevron-down"`. A `codicon-` prefix is stripped, so `"codicon-close"` works too. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | none | Maps to Tailwind text sizes. With no size, the icon inherits the surrounding font size. |
| `decorative` | `boolean` | `true` | When `true`, the icon is hidden from assistive technology (`aria-hidden`). |
| `label` | `string` | — | Used only when `decorative={false}`. Becomes `role="img"` plus `aria-label`. |
| other | `<i>` props | — | `className`, `style`, `ref` and so on. |

Also exported: `normalizeCodiconName(name)`.

## Behavior contract

**Onyx owns:** the Codicon font and CSS (part of `@mroiban/onyx/styles.css`, in the `onyx.base` layer), centering and accessible defaults.

**You supply:** the name, and a label when the icon alone carries meaning.

## Anatomy

A single `<i data-slot="icon" class="codicon codicon-<name>">`.

## Tokens read

None directly. The icon takes its color from `currentColor` and its size from the surrounding font size or `size`.

## Gotchas

- **Icon-only buttons need a label.** Put `aria-label` on the button and keep the icon decorative. Do not label both.
- **Unknown names render blank** and raise no error. Check the name against the Codicon list.
- **Size comes from the parent unless set.** Components such as Button and Menu size their icons in context, so pass `size` only to override them.
