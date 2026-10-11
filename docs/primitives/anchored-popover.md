# AnchoredPopover

Use when an existing DOM control opens an interactive floating surface, such as a workbench status item or a host-managed toolbar button. Use ordinary `Popover` when React owns both the trigger and content.

## Public API

`AnchoredPopover`, `AnchoredPopoverProps`.

`anchor` is an `HTMLElement | null`; null renders nothing. Use a focusable control as the anchor so focus can return on closing. `open` defaults to true for conditionally mounted surfaces. `onOpenChange` is required: dismissals request false and the caller updates its state or unmounts the surface. Content forwards its ref and accepts the same side, align, offsets, collision, container, style, className, HTML attributes and preventable focus/dismissal handlers as `PopoverContent`. The surface exposes `data-slot="anchored-popover"`, `data-state` and `data-side`.

```tsx
const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
const [open, setOpen] = React.useState(false);
return <>
  <button ref={setAnchor} aria-haspopup="dialog" aria-expanded={open}
    onClick={() => setOpen(value => !value)}>Connection</button>
  <AnchoredPopover anchor={anchor} open={open} onOpenChange={setOpen}
    side="top" align="start" aria-label="Connection settings">
    <button onClick={() => setOpen(false)}>Disconnect</button>
  </AnchoredPopover>
</>;
```

## Behavior and styling

No trigger or anchor markup is inserted. Radix attaches its floating reference directly to the supplied element, updates on scroll and resize, flips or shifts around viewport collisions, and manages the nonmodal focus scope and dismissable layer. The content reuses Onyx popover styling, its scroll wrapper, semantic tokens and inherited modal portal container; an explicit `container` overrides the inherited host.

Opening focuses the first eligible control, falling back to the surface. Escape, a close action or a controlled close returns focus to the external anchor. Pointer or focus interactions outside dismiss without moving focus back from the user's destination. Interactions on the anchor are ignored by outside dismissal so its own toggle handler controls opening and closing.

Tab moves normally between content controls. At the end, Tab closes and moves to the next eligible page control after the anchor; Shift+Tab from the beginning closes and returns to the anchor. Nested portalled controls keep their own keyboard handling. Applications can prevent the focus or dismissal events to implement a specialized workflow.
