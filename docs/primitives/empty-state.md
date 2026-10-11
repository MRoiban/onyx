# EmptyState

A centered placeholder for an area with nothing to show: an icon, a title, an explanation and an action to get started.

**Use when:** a list, panel, search or page has no content yet ("No files", "No results for ‘foo’", "Connect a repository to begin").
**Not for:** errors that need attention right away (use [Alert](alert.md)), loading (use [Skeleton](skeleton.md) or [Spinner](spinner.md)), or the empty list inside a dropdown (Combobox has `emptyState`, and Command has `CommandEmpty`).

## Import

```tsx
import { EmptyState, EmptyStateIcon, EmptyStateTitle, EmptyStateDescription, EmptyStateActions } from '@onyx/ui/empty-state';
```

## Example

```tsx
<EmptyState size="sm">
  <EmptyStateIcon><Icon name="search" /></EmptyStateIcon>
  <EmptyStateTitle>No results for “{query}”</EmptyStateTitle>
  <EmptyStateDescription>Try a different term or clear the filters.</EmptyStateDescription>
  <EmptyStateActions><Button variant="secondary" onClick={clear}>Clear filters</Button></EmptyStateActions>
</EmptyState>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `EmptyState` | `tone` | `DisplayTone` | `'neutral'` | |
| | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Use `sm` in sidebars and panels, `lg` for full pages. |
| `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateActions` | `asChild` | | | All optional. |

Also exported: `emptyStateVariants` and a `*Variants` function for each part.

## Behavior contract

**Onyx owns:** layout, sizing and tone. It is presentation only.

**You supply:** the copy and the action. Say why the area is empty and what to do about it.

## Anatomy

`empty-state` (`data-tone`, `data-size`), `empty-state-icon`, `empty-state-title`, `empty-state-description`, `empty-state-actions`.

## Tokens read

`--onyx-empty-state-bg`, `--onyx-tone-*`, `--onyx-surface-panel`, `--onyx-state-hover`, spacing, type and radius tokens.

## Gotchas

- **The title is not a heading element.** Use `asChild` with `<h2>` or `<h3>` if it belongs in the page outline.
