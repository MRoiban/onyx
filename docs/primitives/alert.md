# Alert

An inline message box or a full-width banner with a tone icon, title, description and optional actions. It doesn't move focus.

**Use when:** the page needs to show a persistent status message: a form-level error, "Your trial ends in 3 days", "Offline: changes will sync later".
**Not for:** brief notices that disappear (use [Toast](toast.md)), questions that need an answer (use [Alert Dialog](alert-dialog.md) or [Prompt](prompt.md)), an error on a single field (use [Field](field.md)'s `FieldError`), or an empty area (use [EmptyState](empty-state.md)).

## Import

```tsx
import { Alert, AlertTitle, AlertDescription, AlertActions, useAlert } from '@mroiban/onyx/alert';
```

## Example

```tsx
<Alert tone="warning" title="Unsaved changes" description="Reconnect to sync your edits." actions={<Button size="sm" onClick={retry}>Retry</Button>} />

<Alert variant="banner" tone="info" dismissible onDismiss={markSeen}>
  Bedrock 2.0 is available. <Link href="/changelog">What’s new</Link>
</Alert>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tone` | `DisplayTone` | `'info'` | Picks the icon and colors. |
| `variant` | `'inline' \| 'banner'` | `'inline'` | `banner` spans the full width, for the top of a page or panel. |
| `title`, `description` | `ReactNode` | — | Or compose `AlertTitle` and `AlertDescription` as children. |
| `icon` | `ReactNode \| null` | the tone's icon | `null` hides the icon. |
| `actions` | `ReactNode` | — | Buttons on the right. |
| `dismissible` | `boolean` | `false` | Adds a close button. The Alert hides **itself** when closed. |
| `onDismiss` | `() => void` | — | |
| `dismissLabel` | `string` | `'Dismiss alert'` | |
| `urgency` | `'polite' \| 'assertive'` | assertive for `warning` and `danger` | Sets `role="alert"` (assertive) or `role="status"` (polite). |
| `asChild` | `boolean` | `false` | |

**`useAlert(onDismiss?)`** returns `{ dismissed, dismiss }`.

Also exported: `alertVariants`, `alertTitleVariants`, `alertDescriptionVariants`, `alertActionsVariants`, `toneIcons`.

## Behavior contract

**Onyx owns:** the icon for each tone, the ARIA role, dismissal, and layout.

**You supply:** the message, the actions, and whether it should show. Alerts never close on a timer.

## Anatomy

`alert` (`data-tone`, `data-variant`, `data-state="open"`), `alert-icon`, `alert-title`, `alert-description`, `alert-actions`, `alert-close`.

## Tokens read

`--onyx-alert-{padding-x,padding-y,radius}`, `--onyx-tone-*-{bg,fg}`, spacing, muted text and focus tokens.

## Gotchas

- **Dismissal is internal state.** Remounting the component (for example with a new `key`) shows it again. Store the dismissal in your own state if it must persist.
- **Mount alerts that should be announced.** A `role="alert"` region rendered with the page announces on load. For an announcement after an action, render the Alert when the event happens.
