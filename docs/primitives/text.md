# Text · Heading · SectionLabel · HighlightedText

Shared text styles, plus a helper that highlights search matches inside a string.

| Component | Renders | For |
|---|---|---|
| `Text` | `<p>`, small body text | Paragraphs and descriptions |
| `Heading` | `<h2>`, large and semibold | Section or dialog headings |
| `SectionLabel` | `<span>`, extra-small, semibold and muted | Group labels such as "OPEN EDITORS" or settings group names |
| `HighlightedText` | text with `<mark>` around matches | Search results and filtered lists |

**Use when:** text should follow the theme's type scale and colors.
**Not for:** inline code (use [Code](code.md)), keyboard shortcuts (use [Kbd](kbd.md)), text that may overflow its row (use [Truncate](truncate.md)), or labels for form controls (use [Field](field.md)'s `Label`).

## Import

```tsx
import { Text, Heading, SectionLabel, HighlightedText } from '@onyx/ui/text';
```

## Example

```tsx
<Heading>Workspace</Heading>
<Text tone="description">Files in this folder sync to every device.</Text>
<Heading asChild><h1>Settings</h1></Heading>

<SectionLabel>Recent</SectionLabel>

{/* in a filtered list */}
<HighlightedText text={file.name} terms={[query]} />
```

## API

| Component | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Text` | `tone` | `'default' \| 'muted' \| 'description' \| 'link'` | `'default'` | |
| `Text`, `Heading`, `SectionLabel` | `asChild` | `boolean` | `false` | Use `asChild` to pick the element, for example `<h1>` or `<span>`. |
| `HighlightedText` | `text` | `string` | — | **Required.** |
| | `terms` | `readonly string[]` | — | **Required.** Matched literally, so special characters are safe. Empty terms are ignored. |
| | `caseSensitive` | `boolean` | `false` | |
| | `markProps` | `<mark>` props | — | `className` and `style` for each match. |

Also exported: `textVariants`.

## Behavior contract

**Onyx owns:** the type size, weight, line height and color from tokens. HighlightedText splits the text without a wrapper element, keeping the original whitespace.

**You supply:** the semantics (the right element through `asChild`) and the content.

## Anatomy

`text`, `heading`, `section-label`, `text-highlight` (each `<mark>`).

## Tokens read

`--onyx-text-{xs,sm,lg}`, `--onyx-leading-{normal,tight}`, `--onyx-weight-semibold`, `--onyx-text-{foreground,muted,description,link}`.

## Gotchas

- **Heading is always an `<h2>`** unless you use `asChild`. Choose the level that fits the document outline.
- **HighlightedText returns a fragment**, so put it inside your own element if you need a container.
