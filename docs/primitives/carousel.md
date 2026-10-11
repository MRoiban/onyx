# Carousel

Use when horizontally paging a small set of related slides. Not for autoplay banners, a virtualized collection or tabs.

Anatomy: `carousel`, `carousel-track`, `carousel-slide`, `carousel-previous`, `carousel-next`, `carousel-dots`, `carousel-dot`.

Compose `Carousel` → `CarouselContent` → `CarouselItem` with `CarouselPrevious`, `CarouselNext`, `CarouselDots` as siblings. Root props: `index` / `defaultIndex` (0), `onIndexChange`, `asChild`, and HTML props. Root is a named region with `aria-roledescription="carousel"`; provide `aria-label`. Each item is a group with `aria-roledescription="slide"`; give it a descriptive label or position label (e.g. "2 of 3"). Slides default to 70% width, matching the mockup's peek at the next slide; change that via `className`/style. The track uses native horizontal scroll with mandatory scroll snap.

Previous/next stop at bounds. Dot buttons expose position labels and current state. Left/Right and Home/End navigate from the region/track/controls, while inputs retain their own editing keys. Scroll position is reconciled after scrolling settles. Programmatic scroll honors `prefers-reduced-motion` (instant instead of smooth). There is no autoplay, so pause/resume controls are unnecessary.

State: root `data-orientation="horizontal"`; dots `data-state="active|idle"`, `aria-current`; controls native disabled state.

Tokens: `--onyx-space-{1-5,2,4,10}`, `--onyx-radius-{md,full}`, `--onyx-border-strong`, `--onyx-control-{height-sm,focus-ring,secondary-bg,secondary-fg}`, `--onyx-button-radius`, `--onyx-text-{foreground,sm}`, focus tokens.

Headless: `useCarousel({index,defaultIndex,onIndexChange,count})` returns `trackRef`, index/count, `goTo`, previous/next, bounds and keyboard/scroll handlers. Direct children of the attached track are the slide elements. `carouselVariants` is exported.

[APG carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/).

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

Controlled navigation scrolls only after the parent accepts the new index; a rejected settled user scroll returns to the controlled index. Dots keep their visible geometry with at least 24×24 CSS-pixel pseudo-element targets and spacing that prevents adjacent target overlap.
