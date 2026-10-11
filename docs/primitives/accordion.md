# Accordion

Use when organizing expandable sections with single or multiple expansion. Not for arbitrary tree navigation.

Anatomy: `accordion`, `accordion-item`, `accordion-header`, `accordion-trigger`, `accordion-chevron`, `accordion-meta`, `accordion-content`.

`Accordion` forwards Radix `type="single|multiple"`, `value` / `defaultValue`, `onValueChange`, `disabled`, `orientation`, `dir`, and `asChild`. Single uses string values and supports `collapsible`; multiple uses arrays. Each `AccordionItem` needs a unique `value`. Nest `AccordionTrigger` in `AccordionHeader`. The trigger includes a chevron and optional `meta` slot; `asChild` supplies the complete custom trigger element. Content supports `forceMount`. Radix owns arrow/Home/End trigger navigation, Enter/Space, expansion and ARIA relationships.

State: `data-state="open|closed"`, `data-disabled`, `data-orientation`. W0 `animate-accordion-open` / `animate-accordion-close` classes animate content; reduced motion removes animation.

Tokens: `--onyx-border-default`, `--onyx-radius-md`, `--onyx-space-{0-5,1-5,2,8}`, `--onyx-text-{foreground,muted,description,sm}`, `--onyx-weight-{regular,semibold}`, `--onyx-state-hover`, `--onyx-duration-normal`, `--onyx-ease-standard`, focus tokens. Animations use `--radix-accordion-content-height`.

Headless: `useAccordion({type,value,defaultValue,onValueChange,collapsible})` returns `value`, `setValue`, `toggle(key)`. This headless hook consistently uses arrays, including single mode; it does not generate ARIA markup. The Radix-backed component retains Radix's discriminated string/array API. `accordionVariants` is exported.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.
