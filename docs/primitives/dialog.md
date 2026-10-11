# Dialog

A modal window centered over the page. Use it for a short task the user finishes or cancels before going back, such as renaming, creating or editing settings.

**Use when:** a focused form or decision needs the user's full attention.
**Not for:** destructive or irreversible confirmations (use [Alert Dialog](alert-dialog.md)), a quick keyboard-driven question with fixed answers (use [Prompt](prompt.md)), side panels or filters (use [Sheet](sheet.md)), or controls anchored to a trigger (use [Popover](popover.md)).

## Import

```tsx
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose
} from '@onyx/ui/dialog';
import { Button } from '@onyx/ui/button';
```

## Example

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Rename</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Rename file</DialogTitle>
      <DialogDescription>Enter a new name for “notes.md”.</DialogDescription>
    </DialogHeader>
    <form onSubmit={(event) => { event.preventDefault(); rename(name); setOpen(false); }}>
      <Input autoFocus value={name} onChange={(event) => setName(event.target.value)} />
      <DialogFooter>
        <DialogClose asChild><Button variant="secondary">Cancel</Button></DialogClose>
        <Button type="submit">Rename</Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>
```

## API

Built on [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog). Every Radix prop passes through.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Dialog` | `open`, `defaultOpen`, `onOpenChange`, `modal` | Radix | `modal: true` | Root, with no DOM element. |
| `DialogContent` | `overlayClassName` | `string` | — | Styles the backdrop that `DialogContent` renders for you. |
| | `onOpenAutoFocus`, `onCloseAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside` | Radix | — | Change where focus goes, or decide how the dialog may be dismissed. |
| `DialogHeader`, `DialogFooter` | `asChild` | `boolean` | `false` | Layout wrappers. The footer stacks vertically on narrow screens and right-aligns its buttons from `sm` up. |
| `DialogTitle`, `DialogDescription` | Radix | — | — | **Required** for accessibility. If they should not be visible, add `className="sr-only"`. |
| `DialogTrigger`, `DialogClose` | `asChild` | Radix | — | Wrap your own `Button`. |

## Behavior contract

**Onyx owns:** the portal and backdrop, centering, width (`--onyx-dialog-width`, or `-lg` from `sm` up) capped to the viewport, scrolling inside the dialog beyond 85vh, the focus trap and restoring focus on close, Escape and outside-click dismissal, and portalling nested Combobox, Popover, Menu, Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker content into the dialog.

**You supply:** the open state when it is controlled, the title and description, the body content, and the action buttons.

## Anatomy

`dialog-trigger`, `dialog-overlay`, `dialog-content`, `dialog-header`, `dialog-title`, `dialog-description`, `dialog-footer`, `dialog-close`. Content and overlay expose `data-state="open|closed"`.

## Tokens read

`--onyx-dialog-width` (512px), `--onyx-dialog-width-lg` (576px), `--onyx-surface-dialog`, `--onyx-surface-overlay`, `--onyx-border-default`, `--onyx-shadow-lg`, `--onyx-radius-lg`, `--onyx-space-{2,6}`, `--onyx-text-{lg,md}`, `--onyx-weight-semibold`, `--onyx-text-description`, `--onyx-z-{overlay,dialog}`, `--onyx-scale-{ui,type}`.

## Gotchas

- **Moving focus never closes the dialog.** `onFocusOutside` is always prevented, so a context menu that hands focus back to its trigger as the dialog opens cannot cancel it. Escape and outside clicks still close it. To block those too, prevent `onEscapeKeyDown` and `onPointerDownOutside`.
- **There is no built-in close (×) button.** Add a `DialogClose` yourself if you want one.
- **Opening a dialog from a menu item:** close the menu and open the dialog in the same handler. The focus rule above keeps that working.
- **Nested floating content:** Combobox, Popover, Menu, Tooltip and similar components inside `DialogContent` portal into it automatically. Do not pass `container={document.body}`, or they render behind the dialog's focus trap. [ContextMenu](context-menu.md) and [SectionSelect](section-select.md) do not do this automatically.
