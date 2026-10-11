# Card

A bordered surface that groups related content, with optional header, media, body and footer sections. It can be one big link.

**Use when:** showing items as tiles (projects, pebbles, templates), or grouping a block of settings or stats.
**Not for:** rows in a list (use [Panel rows](panel.md) or [Listbox](listbox.md)), alerts (use [Alert](alert.md)), or page layout alone (use [Stack · Grid](layout.md)).

## Import

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter, CardMedia } from '@mroiban/onyx/card';
```

## Example

```tsx
<Grid minChildWidth="240px" gap="3">
  {pebbles.map((p) => (
    <Card key={p.name} interactive asChild>
      <a href={p.url}>
        <CardMedia><img src={p.thumbnail} alt="" /></CardMedia>
        <CardHeader>
          <CardTitle>{p.name}</CardTitle>
          <CardDescription>{p.description}</CardDescription>
        </CardHeader>
        <CardFooter><Badge tone={p.healthy ? 'success' : 'danger'}>{p.status}</Badge></CardFooter>
      </a>
    </Card>
  ))}
</Grid>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Card` | `interactive` | `boolean` | `false` | Adds hover and focus styling. Pair it with `asChild` and an `<a>` or `<button>`. |
| | `asChild` | `boolean` | `false` | |
| `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`, `CardMedia` | `asChild` | | | Sections, all optional. |

Also exported: `cardVariants` and a `*Variants` function for each section.

## Behavior contract

**Onyx owns:** the surface, the sections and the interactive styling. It is presentation only.

**You supply:** the semantics. An interactive card must be a real link or button through `asChild`.

## Anatomy

`card` (`data-interactive`, `data-state`), `card-media`, `card-header`, `card-title`, `card-description`, `card-body`, `card-footer`.

## Tokens read

`--onyx-card-{radius,border,bg,padding}`, `--onyx-surface-panel`, border, spacing, text, leading, weight and focus tokens.

## Gotchas

- **Don't put buttons inside a card that is a link.** Nested interactive elements are invalid HTML and confuse keyboard users. Either make the whole card the link, or keep the card static with separate buttons in it.
- **`CardTitle` is not a heading element.** Use `asChild` with `<h3>` when the cards belong in the document outline.
