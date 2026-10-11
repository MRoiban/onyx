# Menubar

Use when: application command categories such as File/Edit/View. Not for: site navigation (use NavigationMenu).

## Public API

`menubarVariants`, `Menubar`, `MenubarMenu`, `MenubarPortal`, `MenubarSub`, `MenubarTrigger`, `MenubarGroup`, `MenubarRadioGroup`, `MenubarContent`, `MenubarSubContent`, `MenubarItem`, `MenubarSubTrigger`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`, `MenubarShortcut`.

## Anatomy

`menubar`, `menubar-checkbox-item`, `menubar-content`, `menubar-group`, `menubar-indicator`, `menubar-item`, `menubar-label`, `menubar-radio-item`, `menubar-radiogroup`, `menubar-separator`, `menubar-shortcut`, `menubar-sub-content`, `menubar-sub-trigger`, `menubar-submenu-icon`, `menubar-trigger`.

## Props and state

Radix root value/defaultValue/onValueChange, loop/dir; Menu value; all command/check/radio/submenu props match Menu; Item supports tone and inset.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`.

## Headless behavior

Radix owns horizontal category navigation, menu item roving focus and typeahead.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.
