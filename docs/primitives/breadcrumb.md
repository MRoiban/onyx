# Breadcrumb

The path to the current page or item (`Workspace / src / components / button.tsx`). Long paths collapse their middle into a "…" menu.

**Use when:** content is nested (folders, settings sections, documents) and users need to see where they are and go back up.
**Not for:** main site navigation (use [Navigation Menu](navigation-menu.md)), steps in a process, or switching peer views (use [Tabs](tabs.md) or [SectionSelect](section-select.md)).

## Import

```tsx
import { Breadcrumb, useBreadcrumb } from '@onyx/ui/breadcrumb';
```

## Example

```tsx
<Breadcrumb
  maxItems={4}
  items={[
    { label: 'Workspace', href: '/' },
    { label: 'src', onClick: () => openFolder('src') },
    { label: 'components', onClick: () => openFolder('src/components') },
    { label: 'ui', onClick: () => openFolder('src/components/ui') },
    { label: 'button.tsx' }                      // last item = current page
  ]}
/>
```

You can also build it from the exported parts: `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbSeparator` and `BreadcrumbOverflow`.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `items` | `{ label: ReactNode; href?: string; onClick?: () => void }[]` | — | The last item is the current page. |
| `maxItems` | `number` | show all | The minimum is 3. Middle items move into the overflow menu. |
| `onOverflowClick` | `(hidden) => void` | — | Notifies you that the overflow menu was opened. The menu still opens. |
| `asChild` | `boolean` | `false` | |

**`useBreadcrumb(items, maxItems)`** returns `{ visible, hidden }`.

Also exported: a `*Variants` function for each part.

## Behavior contract

**Onyx owns:** `<nav aria-label="Breadcrumb">` with an ordered list, `aria-current="page"` on the last item, decorative separators, and the overflow [Menu](menu.md) with real links and keyboard support.

**You supply:** the path and the navigation.

## Anatomy

`breadcrumb` (`<nav>`), `breadcrumb-list` (`<ol>`), `breadcrumb-item`, `breadcrumb-link`, `breadcrumb-separator` (`aria-hidden`), `breadcrumb-overflow`.

## Tokens read

`--onyx-text-{description,foreground}`, space, radius, hover and focus tokens, plus Menu tokens for the overflow.

## Gotchas

- **The last item is never a link.** It represents where you are, so it needs no `href`.
- **Long labels:** wrap them in [Truncate](truncate.md) so one long folder name doesn't push the rest off screen.
