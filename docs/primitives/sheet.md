# Sheet

A modal panel that slides in from an edge of the screen. It works as a drawer for filters, details or secondary forms, and as a bottom sheet on mobile.

**Use when:** supplementary content or a longer form should appear without leaving the page (filters, item details, mobile navigation).
**Not for:** a short focused task (use [Dialog](dialog.md)), destructive confirmations (use [Alert Dialog](alert-dialog.md)), or a permanent, resizable side area in a workbench (use [Sidebar](sidebar.md) or [Panel](panel.md)).

## Import

```tsx
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription,
  SheetBody, SheetFooter, SheetClose
} from '@mroiban/onyx/sheet';
```

## Example

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Filters</SheetTitle>
      <SheetDescription>Narrow the file list.</SheetDescription>
    </SheetHeader>
    <SheetBody>…fields…</SheetBody>
    <SheetFooter>
      <SheetClose asChild><Button variant="secondary">Cancel</Button></SheetClose>
      <Button onClick={apply}>Apply</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

## API

Built on [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Sheet` | `open` / `defaultOpen` / `onOpenChange`, `modal` | Radix | `modal: true` | |
| `SheetContent` | `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | `bottom` adds a drag handle (`SheetHandle`) automatically. |
| | `container` | `HTMLElement \| null` | `document.body` | Portal target. |
| | `onOpenAutoFocus`, `onEscapeKeyDown`, `onPointerDownOutside`, `asChild` | Radix | — | |
| `SheetTitle`, `SheetDescription` | Radix | | — | **Both required.** Add `className="sr-only"` to hide them visually. |
| `SheetHeader` / `SheetBody` / `SheetFooter` / `SheetHandle` | `asChild` | | — | The body scrolls. |
| `SheetTrigger`, `SheetClose` | `asChild` | | — | |

Also exported: `sheetVariants`, `SheetPortal`, `SheetOverlay`.

## Behavior contract

**Onyx owns:** the overlay, slide animation, focus trap, Escape and outside-click dismissal, returning focus on close, and moving nested floating content into the sheet.

**You supply:** the title, the description, the content and the actions.

## Anatomy

`sheet-trigger`, `sheet-overlay`, `sheet-content` (`data-side`, `data-state`), `sheet-handle`, `sheet-header`, `sheet-title`, `sheet-description`, `sheet-body`, `sheet-footer`, `sheet-close`.

## Tokens read

`--onyx-surface-dialog`, `--onyx-surface-overlay`, `--onyx-shadow-lg`, `--onyx-z-{overlay,dialog}`, plus spacing, text, radius, border and motion tokens.

## Gotchas

- **Focus moving outside closes the sheet, unlike Dialog.** Sheet doesn't block focus-outside dismissal. If a menu that opens the sheet hands focus back to its trigger, the sheet can close immediately. Prevent `onFocusOutside` in that case.
- **The bottom handle is decorative.** It does not support drag-to-dismiss.
