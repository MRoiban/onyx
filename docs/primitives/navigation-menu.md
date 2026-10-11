# Navigation Menu

Use when: site navigation with related destination cards. Not for: application command menus or arbitrary dialogs.

## Public API

`navigationMenuVariants`, `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`, `NavigationMenuViewport`.

## Anatomy

`navigation-menu`, `navigation-menu-content`, `navigation-menu-indicator`, `navigation-menu-item`, `navigation-menu-link`, `navigation-menu-list`, `navigation-menu-trigger`, `navigation-menu-viewport`.

## Props and state

Radix root value/defaultValue/onValueChange, delayDuration, skipDelayDuration and orientation; Item value; Link href, active and onSelect; Trigger asChild; Content forceMount.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. NavigationMenu root renders a navigation element with the `navigation-menu` DOM slot, forwards its ref and merges className; providers and portals are context-only. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`.

## Headless behavior

Radix owns arrow navigation, hover timing, disclosure and link focus. Floating UI anchors the card panel, flips and shifts it within the viewport using 8px padding.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.
