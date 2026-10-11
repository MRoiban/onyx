# Popover

A floating panel attached to a trigger. It holds interactive content such as settings, filters or a small form, and the page behind it stays usable.

**Use when:** a button reveals a few controls that relate to it (view options, a share panel, quick filters).
**Not for:** text shown on hover (use [Tooltip](tooltip.md) or [Hover Card](hover-card.md)), a list of commands (use [Menu](menu.md)), a blocking decision (use [Dialog](dialog.md) or [Alert Dialog](alert-dialog.md)), a panel anchored to an element you don't render as a Radix trigger (use [AnchoredPopover](anchored-popover.md)), or choosing a value (use [Select](select.md), [Combobox](combobox.md) or [Date Picker](date-picker.md)).

## Import

```tsx
import {
  Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody,
  PopoverFooter, PopoverClose, PopoverArrow, PopoverAnchor
} from '@mroiban/onyx/popover';
```

## Example

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="ghost" size="icon-sm" aria-label="View options"><Icon name="settings" /></Button>
  </PopoverTrigger>
  <PopoverContent side="bottom" align="end">
    <PopoverHeader>View options</PopoverHeader>
    <PopoverBody>
      <Field><Inline justify="between"><Label>Show hidden files</Label><Switch /></Inline></Field>
    </PopoverBody>
    <PopoverFooter>
      <PopoverClose asChild><Button size="sm">Done</Button></PopoverClose>
    </PopoverFooter>
    <PopoverArrow />
  </PopoverContent>
</Popover>
```

## API

Built on [Radix Popover](https://www.radix-ui.com/primitives/docs/components/popover). Every Radix prop passes through.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Popover` | `open` / `defaultOpen` / `onOpenChange`, `modal` | Radix | `modal: false` | Root, with no DOM element. |
| `PopoverContent` | `side`, `align` | Radix | `'bottom'`, `'center'` | |
| | `sideOffset` | `number` | `8` | |
| | `collisionPadding` | `number` | `8` | |
| | `container` | `HTMLElement \| null` | inherited | See [floating content in modals](README.md#floating-content-in-modals). |
| | `onOpenAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`, `asChild` | Radix | — | |
| `PopoverTrigger`, `PopoverAnchor`, `PopoverClose` | `asChild` | | — | `PopoverAnchor` positions the content against a different element than the trigger. |
| `PopoverHeader` / `PopoverBody` / `PopoverFooter` | `asChild` | | — | Layout sections with padding and dividers. |
| `PopoverArrow` | Radix | | — | Optional pointer arrow. |

Also exported: `popoverVariants`, `PopoverPortal`, `PortalContainerProvider` and `usePortalContainer` (see [floating content in modals](README.md#floating-content-in-modals)).

## Behavior contract

**Onyx owns:** positioning with collision handling, moving focus into the panel and back, Escape and outside-click dismissal, scrolling inside when the panel is taller than the space available, and moving into a surrounding Dialog or Sheet automatically.

**You supply:** the trigger, the content, and closing the popover after a completed action when needed.

## Anatomy

`popover-trigger`, `popover-anchor`, `popover-content` (`data-state`, `data-side`, `data-align`), `popover-scroll` (the inner scroller), `popover-header`, `popover-body`, `popover-footer`, `popover-close`, `popover-arrow`.

## Tokens read

`--onyx-surface-menu`, `--onyx-border-*`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-radius-*`, `--onyx-space-*`, `--onyx-text-*`, `--onyx-duration-*`, `--onyx-ease-*`, focus tokens.

## Gotchas

- **The content scrolls inside `popover-scroll`.** It respects the viewport height, a height class or `style.maxHeight`. A direct `PopoverArrow` child stays outside the scroller. With `asChild`, your element does the layout and scrolls itself.
- **The popover is non-modal by default.** Users can still interact with the page. Pass `modal` to trap focus.
