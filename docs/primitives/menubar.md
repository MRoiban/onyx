# Menubar

A horizontal bar of application menus (File, Edit, View, …), like a desktop app's menu bar. Each menu works like [Menu](menu.md).

**Use when:** an app or editor has categories of commands that live at the top of the window.
**Not for:** website navigation with links (use [Navigation Menu](navigation-menu.md)), a single dropdown (use [Menu](menu.md)), or a row of buttons (use [Toolbar](toolbar.md)).

## Import

```tsx
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarShortcut,
  MenubarSeparator, MenubarSub, MenubarSubTrigger, MenubarSubContent,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarLabel, MenubarGroup
} from '@onyx/ui/menubar';
```

## Example

```tsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem onSelect={newFile}>New File <MenubarShortcut>{formatShortcut('cmd+n')}</MenubarShortcut></MenubarItem>
      <MenubarSub>
        <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
        <MenubarSubContent>{recent.map((r) => <MenubarItem key={r.id} onSelect={() => open(r)}>{r.name}</MenubarItem>)}</MenubarSubContent>
      </MenubarSub>
      <MenubarSeparator />
      <MenubarItem tone="danger" onSelect={closeAll}>Close All</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  <MenubarMenu>
    <MenubarTrigger>View</MenubarTrigger>
    <MenubarContent>
      <MenubarCheckboxItem checked={minimap} onCheckedChange={setMinimap}>Minimap</MenubarCheckboxItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

## API

Built on [Radix Menubar](https://www.radix-ui.com/primitives/docs/components/menubar).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Menubar` | `value` / `defaultValue` / `onValueChange` | `string` | — | The open menu's `value`. |
| | `loop`, `dir` | Radix | | |
| `MenubarMenu` | `value` | `string` | — | Needed when you control which menu is open. |
| `MenubarContent`, `MenubarSubContent` | `sideOffset` (`4`), `collisionPadding` (`8`), `container`, `align` | | | `container` is inherited; see [floating content in modals](README.md#floating-content-in-modals). |
| Items | the same as [Menu](menu.md): `onSelect`, `tone`, `inset`, `checked`, `value`, … | | | `MenubarItem`, `MenubarSubTrigger`, `MenubarCheckboxItem`, `MenubarRadioItem`, `MenubarLabel`, `MenubarShortcut`, `MenubarSeparator`. |

Also exported: `menubarVariants`, `MenubarPortal`, and the shared menu variants.

## Behavior contract

**Onyx owns:** Left and Right moving between menus (they stay open while you move), focus moving between items, typeahead, submenus, dismissal, and styling shared with Menu.

**You supply:** the menus, the items and their actions.

## Anatomy

`menubar`, `menubar-trigger` (`data-state`), `menubar-content`, `menubar-sub-content`, `menubar-group`, `menubar-radiogroup`, `menubar-item`, `menubar-sub-trigger`, `menubar-submenu-icon`, `menubar-checkbox-item`, `menubar-radio-item`, `menubar-indicator`, `menubar-label`, `menubar-separator`, `menubar-shortcut`.

## Tokens read

The same as [Menu](menu.md).

## Gotchas

- **The shortcuts shown are labels only.** Register the actual key bindings in your app.
