# Sheet

Use when: supplementary forms, filters or mobile drawers. Not for: critical destructive confirmation.

## Public API

`sheetVariants`, `Sheet`, `SheetPortal`, `SheetTrigger`, `SheetClose`, `SheetTitle`, `SheetDescription`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetBody`, `SheetFooter`, `SheetHandle`.

## Anatomy

`sheet-body`, `sheet-close`, `sheet-content`, `sheet-description`, `sheet-footer`, `sheet-handle`, `sheet-header`, `sheet-overlay`, `sheet-title`, `sheet-trigger`.

## Props and state

Radix dialog open/defaultOpen/onOpenChange and modal; Content side="left|right|top|bottom", container and focus/dismissal events; bottom inserts Handle. Always supply Title and Description.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-surface-dialog`, `--onyx-surface-overlay`, `--onyx-shadow-lg`, `--onyx-z-overlay`, `--onyx-z-dialog`.

## Headless behavior

Radix Dialog owns focus trapping, restoration, Escape and outside dismissal.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.
