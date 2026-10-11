# AnchoredPopover

A [Popover](popover.md) attached to an element that already exists in the page, such as a status bar item or a toolbar button rendered by other code. You pass the element itself instead of wrapping it in a trigger.

**Use when:** you have a reference to the control (a DOM element) but can't or shouldn't wrap it in `PopoverTrigger`, for example a workbench status item or a host-managed toolbar button.
**Not for:** the usual case where your component renders both the trigger and the content (use [Popover](popover.md)), or a command menu at a point (use [ActionMenu](action-menu.md)).

## Import

```tsx
import { AnchoredPopover } from '@mroiban/onyx/anchored-popover';
```

## Example

```tsx
const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
const [open, setOpen] = React.useState(false);

<>
  <button ref={setAnchor} aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
    Connection
  </button>
  <AnchoredPopover anchor={anchor} open={open} onOpenChange={setOpen} side="top" align="start" aria-label="Connection settings">
    <PopoverBody>
      <Button onClick={() => setOpen(false)}>Disconnect</Button>
    </PopoverBody>
  </AnchoredPopover>
</>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `anchor` | `HTMLElement \| null` | — | **Required.** Nothing renders while it is `null`. Use a focusable element so focus can return to it. |
| `open` | `boolean` | `true` | Defaults to open, which suits surfaces you mount only when needed. |
| `onOpenChange` | `(open: boolean) => void` | — | **Required.** Dismissals call it with `false`. Update your state or unmount. |
| `side`, `align`, `sideOffset`, `collisionPadding`, `container`, `className`, `style`, HTML attributes | as [PopoverContent](popover.md) | | |
| `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onInteractOutside`, `onKeyDown` | Radix events | | Call `preventDefault()` to change the default behavior. |

## Behavior contract

**Onyx owns:** positioning against your element without adding any DOM to it (updated on scroll and resize, with collision handling), Popover styling and the inner scroller, focusing the first control on open, and the focus rules below.

**You supply:** the anchor element, the open state, the toggle on the anchor, and its `aria-expanded` and `aria-haspopup`.

## Focus and keyboard

| Action | Result |
|---|---|
| Open | Focuses the first focusable control, or the surface itself if there is none. |
| Escape, a close button, or closing from your code | Closes, and focus returns to the anchor. |
| Click or focus outside | Closes, and focus stays where the user went. |
| Click on the anchor | Ignored by outside dismissal, so the anchor's own toggle decides. |
| Tab past the last control | Closes, and focus moves to the next control in the page after the anchor. |
| Shift+Tab before the first control | Closes, and focus returns to the anchor. |

## Anatomy

`anchored-popover` (`data-state`, `data-side`), containing `popover-scroll`.

## Tokens read

The same as [Popover](popover.md).

## Gotchas

- **Keep the anchor in state.** Store the element through a callback ref (`ref={setAnchor}`) so the popover updates once the anchor mounts. A plain `useRef` value does not trigger a re-render.
- **Unlike Popover, Tab does not loop inside it.** It continues through the page, which suits a non-modal panel.
