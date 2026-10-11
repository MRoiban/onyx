# Truncate

Shortens text that doesn't fit, with an ellipsis at the end or in the middle (`very-long-fi…name.tsx`), and shows the full text in a tooltip, but only when it is actually cut off.

**Use when:** file names, paths, titles or IDs sit in a fixed-width row such as a tree, list, tab or table cell.
**Not for:** paragraphs that should wrap (use [Text](text.md)), or hiding instructions the user needs.

## Import

```tsx
import { Truncate, useTruncate } from '@mroiban/onyx/truncate';
```

## Example

```tsx
<Truncate>{file.name}</Truncate>
<Truncate mode="middle" endCharacters={10} text={file.path} />
<Truncate asChild text={tab.title}><span className="tab-label" /></Truncate>
<Truncate tooltipProps={{ side: 'right', delayDuration: 200 }}>{branch}</Truncate>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `children` | `string` | — | The text. Alternatively, pass `text`. |
| `text` | `string` | — | **Required with `asChild`.** |
| `mode` | `'end' \| 'middle'` | `'end'` | `middle` keeps the last `endCharacters` characters visible, such as a file extension. |
| `endCharacters` | `number` | `12` | Used only in `middle` mode. |
| `tooltipProps` | Tooltip props except `content` and `children` | — | Use `side`, `delayDuration` or `contentProps`. |
| `asChild` | `boolean` | `false` | Pass exactly one element as the child, plus `text`. |
| `tabIndex` | `number` | `0` while overflowing | Overflowing text is focusable, so keyboard users can open the tooltip. |
| other | `<span>` props | — | |

**`useTruncate(text)`** returns `{ ref, measureRef, overflowing }`. Attach `ref` to the constrained element and `measureRef` to a hidden copy of the full text that has no width limit.

Also exported: `truncateVariants`.

## Behavior contract

**Onyx owns:** measuring overflow (with a ResizeObserver, re-measuring once fonts load), the ellipsis, showing the tooltip only while text overflows, and keeping the full text as the accessible name.

**You supply:** the text, and a parent with a constrained width.

## Anatomy

`truncate` (`data-mode="end|middle"`, `data-state="idle|overflowing"`), `truncate-text` or `truncate-start` + `truncate-end`, `truncate-measure` (hidden and `aria-hidden`).

## Tokens read

Tooltip tokens (`--onyx-tooltip-radius`, `--onyx-surface-tooltip`, `--onyx-z-tooltip`, …).

## Gotchas

- **The parent must constrain the width.** Inside flex rows, give the Truncate (or its wrapper) `min-w-0`, or it never overflows and so never truncates.
- **No TooltipProvider is needed.** Truncate includes its own.
- **It takes plain text only.** Rich children are not supported. Highlight matches next to it instead.
