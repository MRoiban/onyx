# Menu

A dropdown list of commands that opens from a button. It supports checkable items, radio choices, submenus and shortcuts.

**Use when:** a button reveals a set of actions ("More actions ⋯", "Sort by", "New ▾").
**Not for:** choosing a form value (use [Select](select.md) or [Combobox](combobox.md)), a right-click menu (use [Context Menu](context-menu.md)), a menu your code opens at a point with no trigger (use [ActionMenu](action-menu.md)), app-level File / Edit / View menus (use [Menubar](menubar.md)), or a searchable command list (use [Command](command.md)).

## Import

```tsx
import {
  Menu, MenuTrigger, MenuContent, MenuItem, MenuShortcut, MenuSeparator, MenuLabel,
  MenuGroup, MenuCheckboxItem, MenuRadioGroup, MenuRadioItem, MenuSub, MenuSubTrigger, MenuSubContent
} from '@onyx/ui/menu';
```

## Example

```tsx
<Menu>
  <MenuTrigger asChild>
    <Button variant="ghost" size="icon-sm" aria-label="More actions"><Icon name="ellipsis" /></Button>
  </MenuTrigger>
  <MenuContent align="end">
    <MenuItem onSelect={duplicate}>Duplicate <MenuShortcut>{formatShortcut('cmd+d')}</MenuShortcut></MenuItem>
    <MenuSub>
      <MenuSubTrigger>Sort by</MenuSubTrigger>
      <MenuSubContent>
        <MenuRadioGroup value={sort} onValueChange={setSort}>
          <MenuRadioItem value="name">Name</MenuRadioItem>
          <MenuRadioItem value="modified">Date modified</MenuRadioItem>
        </MenuRadioGroup>
      </MenuSubContent>
    </MenuSub>
    <MenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>Show hidden files</MenuCheckboxItem>
    <MenuSeparator />
    <MenuItem tone="danger" onSelect={confirmDelete}>Delete</MenuItem>
  </MenuContent>
</Menu>
```

## API

Built on [Radix Dropdown Menu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu). Every Radix prop passes through.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Menu` | `open` / `defaultOpen` / `onOpenChange`, `modal` | Radix | `modal: true` | |
| `MenuTrigger` | `asChild` | | — | Wrap your Button. |
| `MenuContent`, `MenuSubContent` | `side`, `align` | Radix | | |
| | `sideOffset` | `number` | `4` | |
| | `collisionPadding` | `number` | `8` | |
| | `container` | `HTMLElement \| null` | inherited | See [floating content in modals](README.md#floating-content-in-modals). |
| `MenuItem` | `onSelect` | `(event) => void` | — | Call `event.preventDefault()` to keep the menu open. |
| | `tone` | `'neutral' \| 'danger'` | `'neutral'` | |
| | `inset`, `disabled`, `asChild` | | — | `inset` lines the label up with check and radio items. |
| `MenuSubTrigger` | `inset`, `tone` | | — | Adds the chevron automatically. |
| `MenuCheckboxItem` | `checked`, `onCheckedChange` | Radix | — | Always inset, with a check indicator. |
| `MenuRadioGroup` / `MenuRadioItem` | `value`, `onValueChange` / `value` | Radix | — | Always inset, with a dot indicator. |
| `MenuLabel` | `inset` | | — | A non-interactive group heading. |
| `MenuShortcut` | `asChild` | | — | A right-aligned hint. |
| `MenuGroup`, `MenuSeparator`, `MenuSub`, `MenuPortal` | | | | |

Also exported: `menuContentVariants`, `menuItemVariants`, `menuLabelVariants`, `menuSeparatorVariants`, `menuShortcutVariants`. Context Menu and Menubar share these.

## Behavior contract

**Onyx owns:** positioning, focus moving between items, typeahead, submenu arrow keys, check and radio state indicators, Escape and outside dismissal, returning focus to the trigger, and moving into a surrounding Dialog automatically.

**You supply:** the items and their actions.

## Anatomy

`menu-trigger`, `menu-content` (`data-state`, `data-side`), `menu-group`, `menu-radiogroup`, `menu-item` (`data-highlighted`, `data-disabled`, `data-tone`), `menu-sub-trigger`, `menu-submenu-icon`, `menu-sub-content`, `menu-checkbox-item`, `menu-radio-item` (`data-state="checked|unchecked"`), `menu-indicator`, `menu-label`, `menu-separator`, `menu-shortcut`.

## Tokens read

`--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`, `--onyx-font-size`, `--onyx-scale-{type,ui}`, plus spacing, text and motion tokens.

## Gotchas

- **The menu matches the surrounding font.** Text follows `--onyx-font-size` and `--onyx-scale-type`, and geometry follows `--onyx-scale-ui`, so a menu in a compact sidebar looks compact.
- **To open a dialog from an item,** do it in `onSelect`. The [Dialog](dialog.md) ignores the focus that moves back to the trigger as the menu closes.
- **A modal menu blocks the page.** With the default `modal`, clicks outside only close the menu. Set `modal={false}` if hovering over the rest of the page should still work.
