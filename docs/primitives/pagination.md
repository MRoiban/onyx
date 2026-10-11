# Pagination

Use when navigating pages of results. Not for loading infinite-scroll collections or selecting carousel slides.

Anatomy: `pagination`, `pagination-button`, `pagination-ellipsis`.

`Pagination` renders a labelled nav with previous/next controls, page buttons and non-interactive ellipses. Props: `page` / `defaultPage` (1), `totalPages`, `onPageChange`, `siblingCount` (1), `boundaryCount` (1), `renderPage(page,current)`, ordinary nav attributes, and custom `children`. `asChild` is supported with a single custom nav child; use `usePagination` to build custom controls/links in it. `PaginationButton` can also compose a link with `asChild`. Set an appropriate nav `aria-label` when several pagers occur in a page.

Current button publishes `aria-current="page"`, `data-state="active"`; previous/next are disabled at bounds. `getPaginationRange(page,totalPages,siblingCount,boundaryCount)` is pure, clamps the page, returns [] for no pages, keeps boundary/sibling pages and fills a one-page gap. Ellipsis identifiers are stable `ellipsis-start` / `ellipsis-end`.

Tokens: `--onyx-control-height-sm`, `--onyx-space-{0-5,1-5,6}`, `--onyx-button-radius`, `--onyx-text-{foreground,description,sm}`, selection/hover/focus tokens.

Headless: `usePagination(options)` returns `page`, `totalPages`, `pages`, `setPage`, `previous`, `next`, `canPrevious`, `canNext`. `paginationVariants` is exported.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

Initial, controlled, and requested pages normalize to finite integers (floor), clamped to 1 through the normalized total. Non-finite pages fall back to 1; an empty total retains page 1 with navigation disabled.
