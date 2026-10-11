# OverlayScrollbar

Attach an overlay scrollbar to an existing native vertical viewport when its DOM structure or virtualization prevents replacing it with `ScrollArea`.

```tsx
const scrollElementRef = React.useRef<HTMLDivElement>(null);
return <div style={{ position: 'relative', height: 240 }}>
  <div ref={scrollElementRef} style={{ height: '100%', overflow: 'auto', scrollbarWidth: 'none' }}>
    {content}
  </div>
  <OverlayScrollbar scrollElementRef={scrollElementRef} aria-label="Files scroll position" />
</div>;
```

The parent establishes positioning and matches the viewport height. The application owns native scrollbar suppression, content, and the viewport ref. `OverlayScrollbar` forwards its root ref and DOM attributes, merges `className`, and accepts an `aria-label` for its focusable thumb. Slots are `overlay-scrollbar` and `overlay-scrollbar-thumb`; the root exposes `data-visible` and `data-dragging`.

The thumb appears on parent hover, keyboard focus, and pointer drag. Pointer capture supports dragging outside the thumb and clears on release, cancellation, lost capture, and unmount. Arrow keys scroll by 40 UI pixels; Page Up/Down scroll by a viewport; Home/End reach the boundaries. The ARIA value follows native scrolling. An existing viewport ID is reused; otherwise a temporary ID connects `aria-controls` and is removed on unmount.

Scroll, viewport/content resize, and subtree mutations refresh measurements. Direct content children are observed again when replaced, and all listeners and observers are cleaned up. The minimum thumb is 24 UI pixels, clamped to the viewport height. `calculateOverlayScrollbarMetrics({ clientHeight, scrollHeight, scrollTop, minThumbHeight? })` exports the same geometry for headless use, with an unscaled default minimum of 24 pixels.

Styling uses `--onyx-shell-scrollbar-thumb`, `--onyx-shell-scrollbar-thumb-hover`, `--onyx-shell-scrollbar-thumb-active`, `--onyx-scale-ui`, `--onyx-radius-full`, `--onyx-control-focus-ring`, `--onyx-focus-ring-width`, `--onyx-duration-fast`, and `--onyx-ease-standard`. Reduced motion disables the opacity transition. Application-specific colors and units stay in the theme adapter.
