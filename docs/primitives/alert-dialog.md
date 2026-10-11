# Alert Dialog

A modal that interrupts the user to confirm a destructive or irreversible action. It cannot be dismissed by clicking outside, and Cancel has focus when it opens.

**Use when:** confirming something that cannot be undone or is costly to undo: delete, discard changes, revoke access.
**Not for:** a form or a non-destructive task (use [Dialog](dialog.md)), a quick keyboard-driven question with several answers (use [Prompt](prompt.md)), or information that needs no decision (use [Alert](alert.md) or [Toast](toast.md)).

## Import

```tsx
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogIcon,
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction
} from '@mroiban/onyx/alert-dialog';
```

## Example

```tsx
<AlertDialog open={confirming} onOpenChange={setConfirming}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogIcon />
      <AlertDialogTitle>Delete “notes.md”?</AlertDialogTitle>
      <AlertDialogDescription>This permanently removes the file from every device.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={deleteFile}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## API

Built on [Radix Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `AlertDialog` | `open` / `defaultOpen` / `onOpenChange` | Radix | — | |
| `AlertDialogContent` | `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'danger'` | Changes the icon and its color. |
| | `container` | `HTMLElement \| null` | `document.body` | Portal target. |
| | `onOpenAutoFocus` | Radix | — | Prevent it and focus another *safe* element if Cancel is not the right default. |
| `AlertDialogIcon` | `tone` | as above | the Content's `tone` | A warning icon for `danger` and `warning`, otherwise an info icon. Pass children for a custom icon. |
| `AlertDialogTitle`, `AlertDialogDescription` | Radix | | — | **Both required.** |
| `AlertDialogCancel` | Radix | | — | The safe choice. Secondary Button styling, and focused on open. |
| `AlertDialogAction` | Radix | | — | Destructive Button styling. Closes the dialog after `onClick`. |
| `AlertDialogHeader` / `Body` / `Footer`, `AlertDialogTrigger` | `asChild` | | — | |

Also exported: `alertDialogVariants`, `AlertDialogPortal`, `AlertDialogOverlay`.

## Behavior contract

**Onyx owns:** the overlay, focus trap, focusing Cancel first, Escape to cancel, **no** outside-click dismissal, returning focus on close, and moving nested floating content into the dialog.

**You supply:** a title that names the action and the object ("Delete notes.md?"), a description of the consequence, button labels that are verbs, and the action itself.

## Anatomy

`alert-dialog-trigger`, `alert-dialog-overlay`, `alert-dialog-content` (`data-tone`, `data-state`), `alert-dialog-header`, `alert-dialog-icon` (`data-tone`), `alert-dialog-title`, `alert-dialog-description`, `alert-dialog-body`, `alert-dialog-footer`, `alert-dialog-cancel`, `alert-dialog-action`.

## Tokens read

`--onyx-surface-dialog`, `--onyx-surface-overlay`, `--onyx-shadow-lg`, `--onyx-z-{overlay,dialog}`, `--onyx-tone-*-{bg,fg}`, Button tokens, plus spacing, text, radius and motion tokens.

## Gotchas

- **`tone` doesn't change the Action button.** It stays destructive. For a non-destructive confirmation, use a [Dialog](dialog.md) instead.
- **Use verbs on the buttons.** "Delete" and "Cancel" are clearer than "OK" and "Cancel".
- **Async actions:** `AlertDialogAction` closes the dialog right away. To keep it open while work runs, call `event.preventDefault()` in `onClick`, show `loading`, and close it yourself when the work finishes.
