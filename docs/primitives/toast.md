# Toast

Short notifications that stack in a corner and disappear by themselves, such as "Saved", "Deployed babel-lab" or "Upload failed: Retry". You call `toast()` from anywhere under the provider.

**Use when:** confirming that something finished, or reporting a background event the user doesn't have to act on right away.
**Not for:** errors the user must notice and fix (use [Alert](alert.md), which stays until dismissed), questions (use [Alert Dialog](alert-dialog.md) or [Prompt](prompt.md)), or field validation (use [Field](field.md)'s `FieldError`).

## Import

```tsx
import { ToastProvider, useToast } from '@mroiban/onyx/toast';
```

## Example

```tsx
// once, near the app root
<ToastProvider duration={5000} maxVisible={3}>
  <App />
</ToastProvider>

// anywhere below it
function SaveButton() {
  const { toast, update, dismiss } = useToast();
  const save = async () => {
    const id = toast({ title: 'Saving…', duration: 0 });             // 0 = stays until dismissed
    try {
      await doSave();
      update(id, { title: 'Saved', tone: 'success', duration: 3000 });
    } catch {
      update(id, {
        title: 'Save failed', tone: 'danger', duration: 0,
        action: <Button size="sm" onClick={() => { dismiss(id); save(); }}>Retry</Button>
      });
    }
  };
  return <Button onClick={save}>Save</Button>;
}
```

## API

**`ToastProvider`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `duration` | `number` (ms) | `5000` | The default for each toast. |
| `maxVisible` | `number` | `3` | Older toasts wait in a queue, and their timers start only once they are visible. |
| `initialToasts` | `ToastOptions[]` | — | |
| `viewport` | `boolean` | `true` | Set `false` to place `<ToastQueueViewport />` yourself. |
| `inline` | `boolean` | `false` | Renders in the page flow instead of fixed to a corner. |
| `label` | `string` | `'Notifications'` | The viewport's accessible name. |

**`useToast()`** returns:

| Member | Signature | Notes |
|---|---|---|
| `toast` | `(options) => id` | Options: `title` (**required**), `description`, `tone` (`DisplayTone`), `action` (`ReactNode`), `duration` (`0` or `Infinity` keeps it until dismissed). |
| `update` | `(id, patch) => void` | Change a toast in place, for example from loading to done. |
| `dismiss` | `(id?) => void` | With no id, dismisses all toasts. |
| `toasts`, `visible`, `paused`, `expanded`, `remaining(id)` | | The queue state. |

**`useToastQueue(options)`** is the whole queue without UI, for a custom renderer. The low-level parts `ToastViewport`, `ToastRoot`, `ToastContent`, `ToastIcon`, `ToastMessage`, `ToastSource`, `ToastText`, `ToastClose`, `ToastActions`, `ToastProgress` and `ToastQueueViewport`, and their `*Variants` functions, are exported too.

## Behavior contract

**Onyx owns:**
- The queue, stacking and expanding on hover.
- Timers that pause on hover, focus or a hidden tab, and a countdown bar for toasts that expire.
- Escape dismisses the newest toast, and swiping one more than 60px dismisses it.
- One polite live region that announces new and updated toasts (but not dismissals).
- **Focus safety**: when a focused toast disappears, focus moves to the next toast, or back to where it was before. It never takes focus away from where the user has gone.

**You supply:** the messages, the actions, and how long they last.

## Anatomy

`toast-viewport` (`data-variant="fixed|inline"`, `data-state="stacked|expanded"`), `toast` (`data-tone`, `data-state`, `data-background`, `data-paused`), `toast-content`, `toast-icon`, `toast-message`, `toast-source`, `toast-text`, `toast-actions`, `toast-close`, `toast-progress`, `toast-live`.

## Tokens read

`--onyx-toast-{width,bg,border,radius}`, `--onyx-surface-menu`, `--onyx-border-default`, `--onyx-shadow-md`, `--onyx-z-toast`, space, motion, tone and focus tokens.

## Gotchas

- **`useToast` throws outside a `ToastProvider`.**
- **Toasts with an action should last longer,** or use `duration: 0`. Users need time to reach the button.
- **Stacked background toasts are inert.** They can't be clicked until the stack expands on hover or focus.
