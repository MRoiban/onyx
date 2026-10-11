# Skeleton

A shimmering gray placeholder shaped like the content that is about to load: lines of text, an avatar circle, an image block.

**Use when:** you know the layout of the content that is loading and want to avoid a jump when it arrives.
**Not for:** loading of unknown shape or length (use [Spinner](spinner.md)), measurable progress (use [Progress](progress.md)), or telling screen readers that something is loading (Skeleton is hidden from them).

## Import

```tsx
import { Skeleton } from '@onyx/ui/skeleton';
```

## Example

```tsx
<div aria-busy={loading} aria-live="polite">
  {loading ? (
    <Inline gap="3">
      <Skeleton shape="circle" />
      <Stack gap="1" style={{ flex: 1 }}>
        <Skeleton style={{ width: '40%' }} />
        <Skeleton style={{ width: '80%' }} />
      </Stack>
    </Inline>
  ) : <UserRow user={user} />}
</div>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `shape` | `'text' \| 'text-line' \| 'circle' \| 'rect'` | `'text'` | `text-line` is an alias for `text`. |
| `style` | CSS | — | Set the width and height here. |
| `asChild` | `boolean` | `false` | |

Also exported: `skeletonVariants({ shape })`.

## Behavior contract

**Onyx owns:** the shapes, the shimmer (removed under reduced motion), and `aria-hidden`.

**You supply:** sizes that match the real content, and the loading state on a surrounding region (`aria-busy`).

## Anatomy

`skeleton` (`data-variant`, `data-state="loading"`).

## Tokens read

`--onyx-skeleton-{radius,height,size}`, `--onyx-state-{hover,active}`, spacing and duration tokens.

## Gotchas

- **Screen readers don't see it.** Mark the region `aria-busy` while loading, or add a visually hidden "Loading…" message.
