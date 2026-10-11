# OverlayScrollbar

Adds Onyx's overlay scrollbar to a native vertical scroll element you already render, for cases where you can't swap that element for a ScrollArea (a virtualized list, a third-party editor).

**Use when:** you own a scrolling `<div>` and want the theme's scrollbar on it without restructuring.
**Not for:** new scroll regions (use [ScrollArea](scroll-area.md), which includes this), or horizontal scrolling (it is vertical only).

## Import

```tsx
import { OverlayScrollbar, calculateOverlayScrollbarMetrics } from '@onyx/ui/overlay-scrollbar';
```

## Example

```tsx
const scrollRef = React.useRef<HTMLDivElement>(null);

<div style={{ position: 'relative', height: 240 }}>
  <div ref={scrollRef} style={{ height: '100%', overflow: 'auto', scrollbarWidth: 'none' }}>
    {content}
  </div>
  <OverlayScrollbar scrollElementRef={scrollRef} aria-label="Files scroll position" />
</div>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `scrollElementRef` | `RefObject<HTMLElement>` | — | **Required.** The element that scrolls. |
| `aria-label` | `string` | — | Labels the focusable thumb. |
| other | `<div>` props | — | `className` and `ref` apply to the root. |

**`calculateOverlayScrollbarMetrics({ clientHeight, scrollHeight, scrollTop, minThumbHeight? = 24 })`** returns `{ visible, thumbHeight, thumbOffset }`.

## Behavior contract

**Onyx owns:** the thumb's size and position, keeping it updated on scroll, resize and content changes, showing it on parent hover, focus or drag, dragging with pointer capture, keyboard scrolling, ARIA values tied to the native scroll position, and `aria-controls` (borrowing the viewport's id, or adding a temporary one).

**You supply:** a positioned parent the same height as the viewport, the scroll element itself, and **hiding the native scrollbar** (`scrollbar-width: none`).

## Keyboard (thumb focused)

| Key | Result |
|---|---|
| ↑ / ↓ | Scroll 40 UI pixels |
| PageUp / PageDown | Scroll one viewport |
| Home / End | Top / bottom |

## Anatomy

`overlay-scrollbar` (`data-visible`, `data-dragging`), `overlay-scrollbar-thumb`.

## Tokens read

`--onyx-shell-scrollbar-thumb{,-hover,-active}`, `--onyx-scale-ui`, `--onyx-radius-full`, `--onyx-control-focus-ring`, `--onyx-focus-ring-width`, `--onyx-duration-fast`, `--onyx-ease-standard`.

## Gotchas

- **The parent must be `position: relative`.** The scrollbar is absolutely positioned against it.
- **The thumb is at least 24 UI pixels tall**, but never taller than the viewport.
