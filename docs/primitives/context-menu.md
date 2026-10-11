# Context Menu

A menu that opens at the pointer on right-click, long-press or the keyboard's context-menu key. Its parts and styling match [Menu](menu.md).

**Use when:** an element (a file row, a tab, a canvas item) has actions the user reaches by right-clicking it.
**Not for:** commands opened from a visible button (use [Menu](menu.md)), menus opened from your own state at a computed point, for example from a toolbar overflow or a keyboard shortcut (use [ActionMenu](action-menu.md)), or choosing a value (use [Select](select.md)).

## Import

```tsx
import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
  ContextMenuSeparator, ContextMenuShortcut, ContextMenuSub,
  ContextMenuSubTrigger, ContextMenuSubContent, ContextMenuCheckboxItem
} from '@onyx/ui/context-menu';
```

## Example

```tsx
<ContextMenu>
  <ContextMenuTrigger asChild>
    <div className="file-row">notes.md</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={rename}>
      Rename
      <ContextMenuShortcut>F2</ContextMenuShortcut>
    </ContextMenuItem>
    <ContextMenuSub>
      <ContextMenuSubTrigger>Copy path</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem onSelect={copyAbsolute}>Absolute</ContextMenuItem>
        <ContextMenuItem onSelect={copyRelative}>Relative</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuCheckboxItem checked={pinned} onCheckedChange={setPinned}>Pinned</ContextMenuCheckboxItem>
    <ContextMenuSeparator />
    <ContextMenuItem tone="danger" onSelect={confirmDelete}>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

## API

Built on [Radix Context Menu](https://www.radix-ui.com/primitives/docs/components/context-menu). Every Radix prop passes through.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `ContextMenu` | `onOpenChange`, `modal` | Radix | `modal: true` | Root, with no DOM element. The pointer position opens it, so it has no `open` prop. |
| `ContextMenuTrigger` | `asChild`, `disabled` | Radix | — | The area that responds to right-click. |
| `ContextMenuContent`, `ContextMenuSubContent` | `container` | `HTMLElement \| null` | `document.body` | Portal target. Unlike Menu, it does **not** pick up a surrounding Dialog automatically. |
| | `collisionPadding` | `number` | `8` | |
| `ContextMenuItem` | `onSelect` | `(event) => void` | — | Call `event.preventDefault()` to keep the menu open. |
| | `tone` | `'neutral' \| 'danger'` | `'neutral'` | Use `danger` for destructive actions. |
| | `inset`, `disabled` | `boolean` | — | `inset` lines the label up with check and radio items. |
| `ContextMenuSubTrigger` | `inset`, `tone` | as Item | — | Adds the chevron automatically. |
| `ContextMenuCheckboxItem` | `checked`, `onCheckedChange` | Radix | — | Always inset, with a check indicator. |
| `ContextMenuRadioGroup` / `ContextMenuRadioItem` | `value`, `onValueChange` / `value` | Radix | — | Always inset, with a dot indicator. |
| `ContextMenuLabel` | `inset` | `boolean` | — | Non-interactive group heading. |
| `ContextMenuShortcut` | `asChild` | `boolean` | — | Right-aligned hint. |

## Behavior contract

**Onyx owns:** opening at the pointer, collision handling, roving focus, typeahead, submenu arrows, Escape and outside dismissal, and styling shared with Menu and Menubar.

**You supply:** the items and their actions, and anything that should happen after the menu closes, such as opening a dialog.

## Anatomy

`context-menu-trigger`, `context-menu-content`, `context-menu-sub-content`, `context-menu-group`, `context-menu-radiogroup`, `context-menu-item`, `context-menu-sub-trigger`, `context-menu-submenu-icon`, `context-menu-checkbox-item`, `context-menu-radio-item`, `context-menu-indicator`, `context-menu-label`, `context-menu-separator`, `context-menu-shortcut`. Items expose `data-highlighted`, `data-disabled`, `data-tone` and `data-state` (on check and radio items).

## Tokens read

The same as [Menu](menu.md): `--onyx-menu-item-height`, `--onyx-menu-radius`, `--onyx-surface-menu`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-state-selected{,-fg}`, plus spacing, text and motion tokens.

## Gotchas

- **To open a dialog from an item,** do it in `onSelect`. [Dialog](dialog.md) ignores the focus that moves back to the trigger as the menu closes.
- **Inside a Dialog or Sheet,** pass the dialog's content element as `container`, or the menu renders outside the focus trap.
- **Styling helpers are shared:** `menuContentVariants`, `menuItemVariants` and the other menu variants are re-exported here, so a custom part can match the menu.
