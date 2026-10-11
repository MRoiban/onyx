# Hover Card

A preview card that appears after a short delay when the pointer rests on a link or name, or when it gets keyboard focus. Examples are a user profile or a file summary.

**Use when:** extra detail about a person or object is helpful but optional, such as a mention, an avatar or a linked file.
**Not for:** essential information or controls (touch users can't hover), so put those in the UI or use [Popover](popover.md); a short label (use [Tooltip](tooltip.md)); or something opened by a click (use [Popover](popover.md)).

## Import

```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent, HoverCardHeader, HoverCardBody, HoverCardFooter, HoverCardArrow } from '@mroiban/onyx/hover-card';
```

## Example

```tsx
<HoverCard openDelay={400} closeDelay={150}>
  <HoverCardTrigger asChild>
    <Link href={`/users/${user.id}`}>@{user.handle}</Link>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="start">
    <HoverCardHeader><Inline gap="2"><Avatar … /> {user.name}</Inline></HoverCardHeader>
    <HoverCardBody><Text tone="description">{user.bio}</Text></HoverCardBody>
    <HoverCardArrow />
  </HoverCardContent>
</HoverCard>
```

## API

Built on [Radix Hover Card](https://www.radix-ui.com/primitives/docs/components/hover-card).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `HoverCard` | `open` / `defaultOpen` / `onOpenChange` | Radix | — | |
| | `openDelay` / `closeDelay` | `number` (ms) | `700` / `300` | |
| `HoverCardTrigger` | `asChild` | `boolean` | — | Usually wraps a Link. |
| `HoverCardContent` | `side`, `align` | Radix | `'bottom'`, `'center'` | |
| | `sideOffset`, `collisionPadding` | `number` | `8`, `8` | |
| | `container` | `HTMLElement \| null` | inherited | See [floating content in modals](README.md#floating-content-in-modals). |
| `HoverCardHeader` / `Body` / `Footer` | `asChild` | | — | Same sections as Popover. |
| `HoverCardArrow` | Radix | | — | |

Also exported: `hoverCardVariants`, `HoverCardPortal`.

## Behavior contract

**Onyx owns:** hover and focus timing, staying open while the pointer is over the card, collision handling, and moving into a surrounding Dialog automatically.

**You supply:** the preview content, and a trigger that works on its own (for example a link that goes somewhere).

## Anatomy

`hover-card-trigger`, `hover-card-content` (`data-state`, `data-side`), `hover-card-header`, `hover-card-body`, `hover-card-footer`, `hover-card-arrow`.

## Tokens read

`--onyx-surface-menu`, `--onyx-border-*`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-radius-*`, `--onyx-space-*`, `--onyx-text-*`, motion tokens.

## Gotchas

- **Screen readers don't announce the card.** Assistive technology ignores it, so never put the only copy of information in a hover card.
