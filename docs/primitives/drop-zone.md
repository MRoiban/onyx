# Drop Zone

An area that accepts files dropped onto it, and opens the file picker on click, Enter or Space. It checks file types and sizes and shows over and invalid states while dragging.

**Use when:** users add local files by dragging them in, such as uploads and imports.
**Not for:** reordering items in a list (that is drag-and-drop sorting, not files), a plain button (use [File Trigger](file-trigger.md)), or the upload itself (Drop Zone only hands you `File` objects).

## Import

```tsx
import { DropZone, useDropZone, acceptsFile } from '@mroiban/onyx/drop-zone';
```

## Example

```tsx
<DropZone
  accept="image/*,.svg"
  maxSize={5 * 1024 * 1024}
  onFiles={upload}
  onReject={(files) => toast({ title: `${files.length} file(s) rejected`, tone: 'danger' })}   // toast from useToast()
>
  <Stack align="center" gap="1">
    <Icon name="cloud-upload" size="lg" />
    <Text>Drop images here or <strong>browse</strong></Text>
    <Text tone="description">PNG, JPG or SVG, up to 5 MB</Text>
  </Stack>
</DropZone>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `onFiles` | `(files: File[]) => void` | — | Called with the accepted files. |
| `onReject` | `(files: File[]) => void` | — | If **any** file fails, the **whole batch** is rejected. |
| `accept` | `string` | everything | Comma-separated extensions (`.svg`), exact MIME types (`image/png`) or wildcards (`image/*`). |
| `multiple` | `boolean` | `true` | |
| `maxSize` | `number` (bytes) | — | |
| `directory` | `boolean` | `false` | The picker selects folders. |
| `disabled`, `invalid` | `boolean` | | `invalid` forces the error styling. |
| `name`, `form` | `string` | — | Files picked through the picker can submit natively. Dropped files arrive only through `onFiles`. |
| `asChild` | `boolean` | `false` | |
| `children` | `ReactNode` | — | Your prompt content. |

**`useDropZone(options)`** returns `{ isDropTarget, invalid, receive(files), dragProps }`. **`acceptsFile({ name, type }, accept)`** is the pure matching function.

Also exported: `dropZoneVariants`.

## Behavior contract

**Onyx owns:** drag state without flicker (nested drag-enter and drag-leave are counted), checking type and size on drop, opening the picker by keyboard and click, and the over and invalid styling.

**You supply:** the prompt text, uploading, progress, and error messages.

## Anatomy

`drop-zone` (`data-state="idle|over|invalid"`, `data-drop-target`, `data-disabled`), `drop-zone-input` (hidden).

## Tokens read

`--onyx-drop-zone-radius`, `--onyx-drop-zone-padding`, `--onyx-drop-zone-border-width`, `--onyx-border-strong`, `--onyx-tone-{info,danger}-bg`, `--onyx-tone-danger-fg`, `--onyx-control-focus-ring`, `--onyx-text-{muted,description}`, `--onyx-space-*`.

## Gotchas

- **Browsers don't expose file names while dragging.** The over state can't know the extension yet, so files are only checked on drop.
- **One bad file rejects the batch.** To accept the valid files from a mixed drop, leave out `accept` and `maxSize`, and filter with `acceptsFile` in `onFiles`.
