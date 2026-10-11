# File Trigger

A [Button](button.md) that opens the system file picker and passes back the chosen files.

**Use when:** a button such as "Upload", "Import" or "Choose folder" needs to let the user select local files.
**Not for:** a drag-and-drop target (use [Drop Zone](drop-zone.md), which can also open the picker), or managing an upload queue (that belongs in your app or a Gemstone upload pattern).

## Import

```tsx
import { FileTrigger } from '@onyx/ui/file-trigger';
```

## Example

```tsx
<FileTrigger accept=".json,application/json" onFiles={([file]) => importSettings(file)}>
  Import settings
</FileTrigger>

<FileTrigger directory variant="outline" onFiles={addFolder}>
  <Icon name="folder-opened" /> Choose folder
</FileTrigger>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onFiles` | `(files: File[]) => void` | — | Called after the user picks files. |
| `accept` | `string` | — | Extensions and MIME types. This is only a hint to the picker, not validation. |
| `multiple` | `boolean` | `false` | |
| `directory` | `boolean` | `false` | Lets the user pick a folder (`webkitdirectory`). |
| `name`, `form` | `string` | — | Keeps the files in a hidden input so a native form submits them. |
| other | [Button](button.md) props | — | `variant`, `size`, `asChild`, … The ref is the button. |

Also exported: `fileTriggerVariants`.

## Behavior contract

**Onyx owns:** the hidden file input, opening it, and resetting it when it has no `name`, so the same file can be chosen twice in a row.

**You supply:** validating the files (`accept` is not enforced) and uploading them.

## Anatomy

`file-trigger` (a Button), `file-trigger-input` (hidden).

## Tokens read

Button tokens.

## Gotchas

- **Validate the files yourself.** Users can bypass `accept` in the picker. Use `acceptsFile` from [Drop Zone](drop-zone.md) for the same matching rules.
