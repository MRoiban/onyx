# Popover

Use when: anchored interactive settings or workspace controls. Not for: hover-only explanations or blocking confirmations.

## Public API

`Popover`, `PopoverPortal`, `popoverVariants`, `PopoverTrigger`, `PopoverAnchor`, `PopoverClose`, `PopoverContent`, `PopoverArrow`, `PopoverHeader`, `PopoverBody`, `PopoverFooter`.

## Anatomy

`popover-anchor`, `popover-arrow`, `popover-body`, `popover-close`, `popover-content`, `popover-footer`, `popover-header`, `popover-trigger`.

## Props and state

Radix root open/defaultOpen/onOpenChange and modal; Content side/align/sideOffset, collisionPadding, container, focus and dismissal events; Trigger/Anchor/Close accept asChild.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`.

## Headless behavior

Radix owns positioning, focus and dismissal; useControllableState/useFloatingPosition are available for custom markup.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.

Normal content has an inner `popover-scroll` wrapper that scrolls within the outer available viewport height, CSS-class height limit or `style.maxHeight` constraint, subtracting padding and borders, while a direct PopoverArrow remains outside the scroller. With `asChild`, the supplied element owns the layout and scrolls directly.

```tsx
<DialogContent>
  <DialogTitle>Choose</DialogTitle>
  <DialogDescription>Floating controls inherit this Dialog automatically.</DialogDescription>
  <Combobox options={options} />
  <DatePicker />
</DialogContent>
```
