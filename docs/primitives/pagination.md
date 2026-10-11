# Pagination

Previous and next buttons with page numbers, collapsing long ranges into ellipses (`‹ 1 … 4 5 6 … 20 ›`).

**Use when:** results are split into numbered pages that users move between.
**Not for:** infinite scrolling or "Load more" (use a button and your own loading), carousel slides (use [Carousel](carousel.md)), or steps in a wizard.

## Import

```tsx
import { Pagination, PaginationButton, usePagination, getPaginationRange } from '@onyx/ui/pagination';
```

## Example

```tsx
<Pagination aria-label="Search results pages" page={page} totalPages={Math.ceil(total / 20)} onPageChange={setPage} />

{/* with links */}
<Pagination totalPages={20} page={page} renderPage={(p, current) => (
  <PaginationButton asChild><a href={`?page=${p}`} aria-current={current ? 'page' : undefined}>{p}</a></PaginationButton>
)} />
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `totalPages` | `number` | — | **Required.** |
| `page` / `defaultPage` / `onPageChange` | `number` | `1` | Rounded down to a whole number and kept within `1..totalPages`. |
| `siblingCount` | `number` | `1` | How many pages to show on each side of the current page. |
| `boundaryCount` | `number` | `1` | How many pages to always show at each end. |
| `renderPage` | `(page, current) => ReactNode` | a button | Use it for links. |
| `children` | | | Replaces the default controls. |
| `asChild` | `boolean` | `false` | Pass a single custom `<nav>`, and build the inside with `usePagination`. |
| `aria-label` | `string` | — | Needed when there is more than one pager on the page. |

**`usePagination(options)`** returns `{ page, totalPages, pages, setPage, previous, next, canPrevious, canNext }`. **`getPaginationRange(page, total, siblings, boundary)`** returns the entries, with ellipses as `'ellipsis-start'` and `'ellipsis-end'`.

Also exported: `paginationVariants`.

## Behavior contract

**Onyx owns:** the page range calculation, `aria-current="page"`, disabling previous and next at the ends, and non-interactive ellipses.

**You supply:** the total, the current page, and loading that page.

## Anatomy

`pagination` (`<nav>`), `pagination-button` (`data-state="active"` on the current page), `pagination-ellipsis`.

## Tokens read

`--onyx-control-height-sm`, `--onyx-space-{0-5,1-5,6}`, `--onyx-button-radius`, `--onyx-text-{foreground,description,sm}`, selection, hover and focus tokens.

## Gotchas

- **Zero pages is valid.** The page stays at 1 and both arrows are disabled.
