# Menu

Use when: button-triggered commands, checks and mutually exclusive command choices. Not for: value input (use Select/Combobox).

## Public API

`Menu`, `MenuPortal`, `MenuSub`, `MenuTrigger`, `MenuGroup`, `MenuRadioGroup`, `MenuContent`, `MenuSubContent`, `MenuItem`, `MenuSubTrigger`, `MenuCheckboxItem`, `MenuRadioItem`, `MenuLabel`, `MenuSeparator`, `MenuShortcut`.

## Anatomy

`menu-checkbox-item`, `menu-content`, `menu-group`, `menu-indicator`, `menu-item`, `menu-label`, `menu-radio-item`, `menu-radiogroup`, `menu-separator`, `menu-shortcut`, `menu-sub-content`, `menu-sub-trigger`, `menu-submenu-icon`, `menu-trigger`.

## Props and state

Radix open/defaultOpen/onOpenChange and modal; Item tone="neutral|danger", inset, disabled and onSelect; CheckboxItem checked/onCheckedChange; RadioGroup value/onValueChange; Sub open/defaultOpen; Content collisionPadding and container.

All DOM parts forward refs, merge className and expose data-slot. Single-element Radix parts and structural parts support asChild. Roots/providers/portals are context-only and have no DOM slot. Floating parts expose data-state and data-side from Radix; menu items expose data-highlighted/data-disabled and check/radio data-state. All floating placement uses 8px collision padding; body portals inherit the document theme and density. CSS lives in onyx.components and uses motion tokens with reduced-motion support.

## Tokens read

`--onyx-space-*`, `--onyx-text-*`, `--onyx-weight-*`, `--onyx-radius-*`, `--onyx-border-*`, `--onyx-duration-*`, `--onyx-ease-*`, `--onyx-focus-ring-*`, `--onyx-control-focus-ring`, `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`.

## Headless behavior

Radix owns roving focus, typeahead, submenu arrows, selection and dismissal. Shared menu variants also style ContextMenu and Menubar.

## Nested floating content

DialogContent, SheetContent and AlertDialogContent provide their content element as the default portal container. Combobox, Popover, Menu (including submenus), Menubar, Tooltip, HoverCard, NavigationMenu and DatePicker floating content inherit it, keeping pointer interaction, focus and stacking within the modal. Explicit `container` props override the default; `null` requests the Radix/body fallback.

For a consumer modal, capture its element with a callback ref and wrap floating controls in `PortalContainerProvider` (exported from `@onyx/ui/popover`), or pass that element to each floating content's `container` prop. DatePicker accepts it through `contentProps.container`. Keep the container inside the modal's focus scope.
