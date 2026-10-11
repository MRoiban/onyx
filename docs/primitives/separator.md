# Separator

A thin horizontal or vertical line between groups of content, optionally with a centered label ("or").

**Use when:** visually dividing sections of a menu, a form, a toolbar or a list.
**Not for:** a draggable divider between panes (use [ResizeHandle](resize-handle.md) or [SplitView](split-view.md)). Menus and toolbars have their own separators (`MenuSeparator`, `ToolbarSeparator`).

## Import

```tsx
import { Separator } from '@mroiban/onyx/separator';
```

## Example

```tsx
<Separator />
<Separator label="or" />
<Inline gap="2"><span>Left</span><Separator orientation="vertical" /><span>Right</span></Inline>
<Separator decorative={false} label="Archived" />   {/* announced as a separator */}
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | |
| `decorative` | `boolean` | `true` | Decorative lines are hidden from assistive technology (`role="presentation"`). |
| `label` | `string` | — | Shown centered. When not decorative, it also becomes the `aria-label`. |
| `asChild` | `boolean` | `false` | |

Also exported: `separatorVariants`.

## Behavior contract

**Onyx owns:** the line, the label layout and the ARIA role.

**You supply:** whether the separation means something (`decorative={false}`).

## Anatomy

`separator` (`data-orientation`, `data-variant="line|label"`), `separator-label`.

## Tokens read

`--onyx-separator-{color,height}`, `--onyx-border-default`, space and type tokens.

## Gotchas

- **Vertical separators need a parent with a height.** Inside a flex row, the separator stretches to the row's height.
