# ScrollArea

Use when a native scrolling viewport needs an overlay scrollbar and optional edge shadows. Not for virtualizing rows.

Anatomy: `scroll-area`, `scroll-area-viewport`, `scroll-area-scrollbar`, `scroll-area-thumb`, `scroll-area-corner`, `scroll-area-shadow-top`, `scroll-area-shadow-bottom`.

`ScrollArea` composes Radix root/viewport/vertical scrollbar and optionally a horizontal scrollbar with `horizontal`. It forwards root props, including `type="hover|scroll|auto|always"`, `dir`, `scrollHideDelay`, and `asChild`; `viewportProps` accepts the viewport ref/handlers/attributes. Set an explicit height. `edgeShadows` reports top/bottom scrollability and shows gradients as content moves; resize/mutation observers refresh them. For custom anatomy or a custom root, compose `ScrollAreaRoot`, `ScrollAreaViewport`, `ScrollAreaScrollbar`, `ScrollAreaThumb`, `ScrollAreaCorner`. A scrollbar inserts a thumb by default; supply children to customize it.

State: root `data-scrolled-top`, `data-scrolled-bottom`; scrollbar `data-orientation` and Radix `data-state="visible|hidden"`; shadow `data-visible`. Thumb widens on hover and uses active/hover colors.

Tokens: `--onyx-shell-scrollbar-thumb`, `--onyx-shell-scrollbar-thumb-hover`, `--onyx-shell-scrollbar-thumb-active`, `--onyx-space-{0-5,1-5,2}`, `--onyx-radius-{md,full}`, `--onyx-border-{default,strong}`, `--onyx-duration-fast`, `--onyx-ease-standard`.

Behavior is delegated to Radix ScrollArea; `scrollAreaVariants` is exported. Native scroll events and the viewport ref are the headless integration surface.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.
