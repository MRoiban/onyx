# Stack · Inline · Container · Grid

Layout building blocks that space and align their children using Onyx's spacing scale, with no app CSS needed.

| Component | Lays out children… |
|---|---|
| `Stack` | Vertically, with a gap (a flex column) |
| `Inline` | Horizontally, with a gap, wrapping by default (a flex row) |
| `Container` | Centered, with a maximum width and padding |
| `Grid` | In equal columns, or in as many columns as fit a minimum width |

**Use when:** arranging any group of elements: form fields, button rows, cards, page sections.
**Not for:** workbench shells with resizable panes (use [SplitView](split-view.md), [Sidebar](sidebar.md) and [Panel](panel.md)), data tables (use [Table](table.md)), or app-specific shells, which belong in Gemstone or your app.

## Import

```tsx
import { Stack, Inline, Container, Grid, spaceValue } from '@mroiban/onyx/layout';
```

## Example

```tsx
<Container size="sm" padding="6">
  <Stack gap="4">
    <Heading asChild><h1>Settings</h1></Heading>
    <Field>…</Field>
    <Field>…</Field>
    <Inline justify="end" gap="2">
      <Button variant="secondary">Cancel</Button>
      <Button>Save</Button>
    </Inline>
  </Stack>
</Container>

<Grid minChildWidth="220px" gap="3">
  {projects.map((project) => <Card key={project.id}>…</Card>)}
</Grid>
```

## API

`SpaceStep` is one of `'0-5' | '1' | '1-5' | '2' | '3' | '4' | '5' | '6' | '8' | '10'`, which map to `--onyx-space-<step>`.

| Component | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Stack` | `gap` | `SpaceStep` | `'3'` | |
| | `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | stretch | Cross-axis alignment. |
| | `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | start | |
| | `direction` | `'column' \| 'row' \| 'column-reverse' \| 'row-reverse'` | `'column'` | |
| `Inline` | `gap` | `SpaceStep` | `'2'` | |
| | `align` | as Stack | `'center'` | |
| | `justify` | as Stack | start | |
| | `wrap` | `boolean` | `true` | |
| `Container` | `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Maximum width: sm = 35, md = 48, lg = 64 × `--onyx-space-4`. |
| | `padding` | `SpaceStep` | `'4'` | |
| `Grid` | `columns` | `number` | `1` | Equal columns. |
| | `minChildWidth` | CSS length | — | Fits as many columns as possible at that width, and overrides `columns`. |
| | `gap` | `SpaceStep` | `'3'` | |
| all | `asChild` | `boolean` | `false` | Use `asChild` to render a semantic element such as `<section>` or `<ul>`. |

`spaceValue(step)` returns `var(--onyx-space-<step>)` for your own styles.

## Behavior contract

**Onyx owns:** flex and grid layout through CSS variables, and the defaults. Defaults live in CSS, so an override on an ancestor applies to everything inside it.

**You supply:** the semantics (`asChild` with the right element) and any ARIA.

## Anatomy

`stack` (`data-direction`), `inline` (`data-wrap`), `container` (`data-size`), `grid` (`data-variant="columns|auto-fill"`).

## Tokens read

`--onyx-stack-{gap,align,justify,direction}`, `--onyx-inline-{gap,align,justify,wrap}`, `--onyx-container-{padding,max-width}`, `--onyx-grid-{gap,columns}`, `--onyx-space-*`.

## Gotchas

- **Only the props you pass become inline variables.** Leaving a prop out lets the CSS default, or an ancestor's override, apply. A `style` prop you pass is merged last, so it wins.
- **Inline wraps by default.** Set `wrap={false}` for toolbars and rows that must stay on one line.
- **Use these before writing flex CSS.** They keep spacing on the theme's scale, so density changes apply everywhere.
