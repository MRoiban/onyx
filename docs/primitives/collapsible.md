# Collapsible

Use when independently revealing optional content. Not for a coordinated set of mutually exclusive sections (use Accordion).

Anatomy: `collapsible`, `collapsible-trigger`, `collapsible-chevron`, `collapsible-content`.

`Collapsible` wraps Radix Root: `open` / `defaultOpen`, `onOpenChange`, `disabled`, and `asChild`. `CollapsibleTrigger` is a button with a default chevron; with `asChild`, supply the complete custom trigger contents. `CollapsibleContent` supports `forceMount`. Radix connects `aria-expanded`, `aria-controls`, keyboard activation and disabled state.

State: Radix `data-state="open|closed"`, `data-disabled`. Content uses W0 `animate-collapsible-open` / `animate-collapsible-close`; reduced motion removes animation.

Tokens: `--onyx-space-{0-5,1}`, `--onyx-text-{xs,description}`, `--onyx-weight-semibold`, `--onyx-duration-normal`, `--onyx-ease-standard`, `--onyx-control-focus-ring`, `--onyx-focus-ring-{width,offset}`. Animations read `--radix-collapsible-content-height`.

Headless: `useCollapsible(options)` returns `open`, `setOpen`, `toggle`. Bind ARIA yourself when supplying your own markup. `collapsibleVariants` is exported.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.
