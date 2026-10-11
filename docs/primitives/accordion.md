# Accordion

A stack of collapsible sections, configured so only one is open at a time (`single`) or any number (`multiple`).

**Use when:** content splits into several labeled sections and users usually need only some of them: FAQs, settings groups, sidebar views with "Open Editors / Outline / Timeline".
**Not for:** a single expandable block (use [Collapsible](collapsible.md)), panels the user switches between (use [Tabs](tabs.md)), or nested hierarchies (use [Tree](tree.md)).

## Import

```tsx
import { Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent, useAccordion } from '@onyx/ui/accordion';
```

## Example

```tsx
<Accordion type="multiple" defaultValue={['editors']}>
  <AccordionItem value="editors">
    <AccordionHeader>
      <AccordionTrigger meta={<Count value={openEditors.length} />}>Open Editors</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
  <AccordionItem value="outline">
    <AccordionHeader><AccordionTrigger>Outline</AccordionTrigger></AccordionHeader>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
</Accordion>
```

## API

Built on [Radix Accordion](https://www.radix-ui.com/primitives/docs/components/accordion).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Accordion` | `type` | `'single' \| 'multiple'` | — | **Required.** |
| | `value` / `defaultValue` / `onValueChange` | `string` (single) or `string[]` (multiple) | | |
| | `collapsible` | `boolean` | `false` | Single mode only: allows closing the open item. |
| | `disabled`, `orientation`, `dir`, `asChild` | Radix | | |
| `AccordionItem` | `value` | `string` | — | **Required** and unique. |
| `AccordionHeader` | | | | **Required** around the trigger (it renders the heading element). |
| `AccordionTrigger` | `meta` | `ReactNode` | — | Right-aligned extra content, such as a count. |
| | `asChild` | `boolean` | `false` | You provide the whole trigger. |
| `AccordionContent` | `forceMount` | Radix | — | |

**`useAccordion({ type, value, defaultValue, onValueChange, collapsible })`** returns `{ value, setValue, toggle(key) }`, **always using arrays**, even in single mode. It adds no ARIA.

Also exported: `accordionVariants`.

## Behavior contract

**Onyx owns:** expansion state, arrow/Home/End navigation between triggers, Enter and Space, the ARIA relationships, the chevron, and the animation (removed under reduced motion).

**You supply:** the sections and their content.

## Anatomy

`accordion`, `accordion-item`, `accordion-header`, `accordion-trigger`, `accordion-chevron`, `accordion-meta`, `accordion-content`, each with `data-state="open|closed"`, `data-disabled` and `data-orientation`.

## Tokens read

`--onyx-border-default`, `--onyx-radius-md`, `--onyx-space-{0-5,1-5,2,8}`, `--onyx-text-{foreground,muted,description,sm}`, `--onyx-weight-{regular,semibold}`, `--onyx-state-hover`, `--onyx-duration-normal`, `--onyx-ease-standard`, focus tokens.

## Gotchas

- **In single mode, the open item can't be closed** unless `collapsible` is set.
