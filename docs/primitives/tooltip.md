# Tooltip

A short label that appears when the pointer hovers over a control or the control gets keyboard focus. It can include a keyboard shortcut.

**Use when:** naming an icon-only button, or adding a short hint and its shortcut ("Save ⌘S").
**Not for:** anything interactive or essential to complete a task, since touch users never see tooltips (put it in the UI or use [Popover](popover.md)), a rich preview of a person or object (use [Hover Card](hover-card.md)), or long text that is truncated (use [Truncate](truncate.md), which adds its own tooltip).

## Import

```tsx
import { Tooltip, TooltipProvider } from '@mroiban/onyx/tooltip';
import { formatShortcut } from '@mroiban/onyx/kbd';
```

## Example

Wrap the app (or a region) once in `TooltipProvider`, then:

```tsx
<TooltipProvider delayDuration={400}>
  <Tooltip content="New file" shortcut={formatShortcut('cmd+n')}>
    <Button size="icon-sm" variant="ghost" aria-label="New file"><Icon name="new-file" /></Button>
  </Tooltip>

  <Tooltip content="Collapse all" side="bottom">
    <Button size="icon-sm" variant="ghost" aria-label="Collapse all"><Icon name="collapse-all" /></Button>
  </Tooltip>
</TooltipProvider>
```

For a fully custom tooltip, use `TooltipRoot`, `TooltipTrigger`, `TooltipContent` and `TooltipArrow` (Radix parts).

## API

Built on [Radix Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `TooltipProvider` | `delayDuration`, `skipDelayDuration`, `disableHoverableContent` | Radix | `700`, `300` | **Required ancestor.** Shared delays, so moving between tooltips is instant. |
| `Tooltip` | `content` | `ReactNode` | — | The tooltip text. When it is set, the child becomes the trigger (`asChild`). |
| | `shortcut` | `ReactNode` | — | Shown in a [Kbd](kbd.md) after the text. |
| | `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | |
| | `contentProps` | `TooltipContentProps` | — | Passed to the content: `align`, `className`, `container` and so on. |
| | `open` / `defaultOpen` / `onOpenChange`, `delayDuration` | Radix | — | |
| `TooltipContent` | `shortcut`, `container`, `sideOffset` (`8`), `collisionPadding` (`8`) | | | For custom composition. |

Also exported: `tooltipVariants`, `TooltipPortal`.

## Behavior contract

**Onyx owns:** opening on hover and focus with delays, `aria-describedby` on the trigger, closing on Escape, blur or pointer leave, collision handling, and moving into a surrounding Dialog or Sheet automatically.

**You supply:** the provider, the text, and an accessible name on the trigger itself. The tooltip describes the trigger; it does not name it.

## Anatomy

`tooltip-trigger`, `tooltip-content` (`data-state="closed|delayed-open|instant-open"`, `data-side`, `data-align`), `tooltip-shortcut`, `tooltip-arrow`.

## Tokens read

`--onyx-tooltip-radius`, `--onyx-surface-tooltip`, `--onyx-control-button-fg`, `--onyx-z-tooltip`, `--onyx-shadow-sm`, `--onyx-space-*`, `--onyx-text-*`, motion tokens.

## Gotchas

- **Without `TooltipProvider`, Radix throws.** Add it once near the root of the app.
- **The trigger must hold a ref and take focus.** Use a Button or another focusable element. Disabled buttons do not fire hover events, so wrap them in a `<span tabIndex={0}>`.
- **Icon-only buttons still need `aria-label`.** The tooltip alone is not their accessible name.
