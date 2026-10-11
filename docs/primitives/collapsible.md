# Collapsible

A single show/hide section. A trigger with a chevron reveals or hides the content below it.

**Use when:** one block of optional content can be expanded on its own: "Advanced options", "Show details", a section in a sidebar view.
**Not for:** a set of sections that should behave together (use [Accordion](accordion.md)), switching between panels (use [Tabs](tabs.md)), or tree data (use [Tree](tree.md)).

## Import

```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent, useCollapsible } from '@mroiban/onyx/collapsible';
```

## Example

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger>Advanced options</CollapsibleTrigger>
  <CollapsibleContent>
    <Field>…</Field>
  </CollapsibleContent>
</Collapsible>
```

## API

Built on [Radix Collapsible](https://www.radix-ui.com/primitives/docs/components/collapsible).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Collapsible` | `open` / `defaultOpen` / `onOpenChange` | `boolean` | `false` | |
| | `disabled`, `asChild` | | | |
| `CollapsibleTrigger` | `asChild` | `boolean` | `false` | A button with a chevron. With `asChild`, you provide the whole trigger, chevron included. |
| `CollapsibleContent` | `forceMount` | Radix | — | Keeps the content in the DOM while closed. |

**`useCollapsible({ open, defaultOpen, onOpenChange })`** returns `{ open, setOpen, toggle }`. Wire the ARIA yourself if you build your own markup.

Also exported: `collapsibleVariants`.

## Behavior contract

**Onyx owns:** `aria-expanded` and `aria-controls`, keyboard activation, and the open and close animation (removed under reduced motion).

**You supply:** the trigger label and the content.

## Anatomy

`collapsible`, `collapsible-trigger`, `collapsible-chevron`, `collapsible-content`, each with `data-state="open|closed"` and `data-disabled`.

## Tokens read

`--onyx-space-{0-5,1}`, `--onyx-text-{xs,description}`, `--onyx-weight-semibold`, `--onyx-duration-normal`, `--onyx-ease-standard`, `--onyx-control-focus-ring`, `--onyx-focus-ring-{width,offset}`.
