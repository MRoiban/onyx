# Carousel

A horizontally scrolling row of slides that snap into place, with previous and next buttons and position dots. The next slide peeks in at the edge. There is no autoplay.

**Use when:** a small set of related items (screenshots, onboarding steps, featured templates) can be browsed one at a time.
**Not for:** auto-rotating banners, large collections (use [Grid](layout.md) or a [VirtualList](virtual-list.md)), or switching panels (use [Tabs](tabs.md)).

## Import

```tsx
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots, useCarousel } from '@mroiban/onyx/carousel';
```

## Example

```tsx
<Carousel aria-label="Screenshots" index={index} onIndexChange={setIndex}>
  <CarouselContent>
    {shots.map((s, i) => (
      <CarouselItem key={s.id} aria-label={`${i + 1} of ${shots.length}`}><img src={s.src} alt={s.alt} /></CarouselItem>
    ))}
  </CarouselContent>
  <Inline justify="between">
    <CarouselPrevious />
    <CarouselDots />
    <CarouselNext />
  </Inline>
</Carousel>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Carousel` | `index` / `defaultIndex` / `onIndexChange` | `number` | `0` | |
| | `aria-label` | `string` | — | **Required.** The root is a region with `aria-roledescription="carousel"`. |
| | `asChild` | `boolean` | `false` | |
| `CarouselContent` | | | | The scroll track. Its direct children are the slides. |
| `CarouselItem` | `aria-label` | `string` | — | Label each slide, for example "2 of 5". Slides are 70% wide by default. |
| `CarouselPrevious`, `CarouselNext`, `CarouselDots` | button props | | | Disabled at the first and last slide. Dots are labeled with their position. |

**`useCarousel({ index, defaultIndex, onIndexChange, count })`** returns `trackRef`, the index and count, `goTo`, previous and next, the bounds, and the keyboard and scroll handlers.

Also exported: `carouselVariants`.

## Behavior contract

**Onyx owns:** native scrolling with snap points, keeping the index in sync once scrolling settles, keyboard navigation, scrolling instantly instead of smoothly under reduced motion, button and dot state, and dot targets of at least 24px.

**You supply:** the slides, their labels, and the index if it is controlled.

## Keyboard

| Key | Result |
|---|---|
| ← / → | Previous / next slide |
| Home / End | First / last slide |

Text fields inside slides keep their own editing keys.

## Anatomy

`carousel` (`data-orientation="horizontal"`), `carousel-track`, `carousel-slide`, `carousel-previous`, `carousel-next`, `carousel-dots`, `carousel-dot` (`data-state="active|idle"`, `aria-current`).

## Tokens read

`--onyx-space-{1-5,2,4,10}`, `--onyx-radius-{md,full}`, `--onyx-border-strong`, `--onyx-control-{height-sm,focus-ring,secondary-bg,secondary-fg}`, `--onyx-button-radius`, `--onyx-text-{foreground,sm}`, focus tokens.

## Gotchas

- **A controlled index can veto scrolling.** If the user swipes and your `onIndexChange` doesn't accept the change, the carousel scrolls back to your index.
- **Change slide width with `className` or `style`** on `CarouselItem`.
