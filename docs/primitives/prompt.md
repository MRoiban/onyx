# Prompt

A compact card that asks one question and offers a stacked list of answers, operated mainly by keyboard. It is modeled on Zed's prompt: no title, a message, an optional detail line, and full-width buttons.

**Use when:** the app needs an answer from a fixed set before it can continue, for example "Save changes before closing?" → Save / Don't Save / Cancel.
**Not for:** answers that need input fields (use [Dialog](dialog.md)), destructive confirmations that need emphasis and an icon (use [Alert Dialog](alert-dialog.md)), or messages that need no answer (use [Toast](toast.md) or [Alert](alert.md)).

## Import

```tsx
import { Prompt } from '@mroiban/onyx/prompt';
```

## Example

`Prompt` renders only the card. **You position it and provide any backdrop:**

```tsx
{pending && (
  <div className="fixed inset-0 z-[var(--onyx-z-dialog)] grid place-items-center bg-[var(--onyx-surface-overlay)]">
    <Prompt
      message="Save changes to `notes.md` before closing?"
      detail="Your changes will be lost if you don't save them."
      actions={['Save', "Don't Save", 'Cancel']}
      onRespond={(index) => {
        setPending(null);
        if (index === 0) save();
        if (index === 1) discard();
      }}
    />
  </div>
)}
```

`onRespond` reports the action's **index**, so map it back to your own actions.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `message` | `string` | — | **Required.** The question. It also becomes the card's `aria-label`. |
| `detail` | `string \| null` | — | A smaller, muted line under the message. |
| `actions` | `readonly string[]` | — | **Required.** Button labels from top to bottom. The first one starts active. |
| `onRespond` | `(index: number) => void` | — | **Required.** Called with the chosen action's index. |
| `cancelLabel` | `string` | `'Cancel'` | The action that Escape picks. |
| `className` | `string` | — | |

Backticks in `message` and `detail` render as inline code, and `\n` renders as a line break. No other Markdown is supported.

Headless helpers: `resolvePromptCancelIndex(actions, cancelLabel?)`, `stepPromptActionIndex(current, count, direction)`, `renderPromptText(text)`.

## Behavior contract

**Onyx owns:** focusing the active action when it mounts, the arrow/Tab/Home/End cycle, Enter to choose, Escape to choose the cancel action, the `alertdialog` role and the styling of the active action.

**You supply:** positioning, the backdrop, mounting and unmounting it, what each answer does, and returning focus afterwards.

## Keyboard

| Key | Result |
|---|---|
| ↓ / Tab | Next action, wrapping around |
| ↑ / Shift+Tab | Previous action, wrapping around |
| Home / End | First / last action |
| Enter | `onRespond(activeIndex)` |
| Escape | `onRespond(index of cancelLabel)`, or **nothing** when there is no such action |

## Anatomy

`prompt` (`role="alertdialog"`, `aria-modal`), `prompt-message`, `prompt-detail`, `prompt-code`, `prompt-actions`, `prompt-action` (with `data-active="true"` on the active one).

## Tokens read

`--onyx-prompt-width` (320px), `--onyx-surface-dialog`, `--onyx-border-default`, `--onyx-shadow-lg`, `--onyx-radius-{xs,sm,lg}`, `--onyx-space-{1,2,4,8}`, `--onyx-control-height-sm`, `--onyx-control-focus-ring`, `--onyx-state-hover`, `--onyx-text-{sm,foreground,description}`, `--onyx-font-mono`, `--onyx-scale-ui`.

## Gotchas

- **No portal and no focus trap.** Prompt is a plain element. Render it in an overlay layer of your own, and make sure nothing else on the page can take focus while it is open.
- **A prompt without a cancel action cannot be dismissed.** If `actions` has no `cancelLabel` entry, Escape does nothing, which is deliberate for questions that must be answered.
- **The active action resets** to the first one whenever `actions` or `message` changes. Keep `actions` stable, for example with a constant or `useMemo`, so re-renders do not reset it.
