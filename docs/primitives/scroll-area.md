# ScrollArea

A scrolling region with a themed, overlay scrollbar (it takes no layout space) and optional fade shadows at the top and bottom edges while content is scrolled.

**Use when:** a panel, sidebar, popover or dialog body scrolls and should use the theme's scrollbar.
**Not for:** an existing scroller you can't restructure, such as a virtualized one (attach an [OverlayScrollbar](overlay-scrollbar.md)), or long lists (combine it with [VirtualList](virtual-list.md) or use [Listbox](listbox.md)'s `virtualized`).

## Import

```tsx
import { ScrollArea } from '@mroiban/onyx/scroll-area';
```

## Example

```tsx
<ScrollArea style={{ height: 320 }} edgeShadows>
  <Stack gap="2">{items.map(renderItem)}</Stack>
</ScrollArea>

<ScrollArea style={{ height: '100%' }} horizontal type="always" viewportProps={{ ref: viewportRef, onScroll }}>
  <WideTable />
</ScrollArea>
```

## API

Built on [Radix Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `edgeShadows` | `boolean` | `false` | Fades the top and bottom edges when there is more content in that direction. |
| `horizontal` | `boolean` | `false` | Adds a horizontal scrollbar. |
| `type` | `'hover' \| 'scroll' \| 'auto' \| 'always'` | Radix default | When the scrollbar shows. |
| `scrollHideDelay`, `dir`, `asChild` | Radix | | |
| `viewportProps` | viewport props, including `ref` | — | Use these for the scroll element: its ref, `onScroll` and attributes. |

For custom anatomy, compose `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollAreaScrollbar` (which adds a thumb unless you pass children), `ScrollAreaThumb` and `ScrollAreaCorner`.

Also exported: `scrollAreaVariants`.

## Behavior contract

**Onyx owns:** the scrollbar styling (the thumb widens on hover), the edge shadows and keeping them up to date as content changes, and native scrolling.

**You supply:** a height, and the content.

## Anatomy

`scroll-area` (`data-scrolled-top`, `data-scrolled-bottom`), `scroll-area-viewport`, `scroll-area-scrollbar` (`data-orientation`, `data-state="visible|hidden"`), `scroll-area-thumb`, `scroll-area-corner`, `scroll-area-shadow-top`, `scroll-area-shadow-bottom` (`data-visible`).

## Tokens read

`--onyx-shell-scrollbar-thumb{,-hover,-active}`, `--onyx-space-{0-5,1-5,2}`, `--onyx-radius-{md,full}`, `--onyx-border-{default,strong}`, `--onyx-duration-fast`, `--onyx-ease-standard`.

## Gotchas

- **It needs a height.** Without one, it grows with its content and never scrolls.
- **Get the scroll element from `viewportProps.ref`.** The root `ref` is the outer wrapper, which doesn't scroll.
