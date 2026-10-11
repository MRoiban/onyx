# ActionMenu

A command menu your code opens at a screen point, built from a plain array of items. There is no trigger element to render.

**Use when:** app state decides when and where a menu appears, for example an "open menu named X" service, a toolbar overflow, a keyboard shortcut, or a context menu you already handle yourself.
**Not for:** a menu opened from a button (use [Menu](menu.md)), a right-click menu on an element you render (use [Context Menu](context-menu.md); it handles the pointer position for you), or a searchable list of commands (use [Command](command.md)).

## Import

```tsx
import { ActionMenu, type ActionMenuItem } from '@onyx/ui/action-menu';
```

## Example

```tsx
const [menu, setMenu] = React.useState<{ x: number; y: number } | null>(null);

const items: readonly ActionMenuItem[] = [
  { id: 'open', label: 'Open', shortcut: '⌘O', icon: <Icon name="go-to-file" />, onSelect: openWorkspace },
  { id: 'recent', label: 'Open Recent', items: recent.map((r) => ({ id: r.id, label: r.name, onSelect: () => open(r) })) },
  { id: 'rename', label: 'Rename', group: 'Workspace', onSelect: startRename },
  { id: 'remove', label: 'Remove', group: 'Workspace', disabled: !canRemove, onSelect: remove }
];

<div onContextMenu={(event) => { event.preventDefault(); setMenu({ x: event.clientX, y: event.clientY }); }} />

<ActionMenu
  open={menu !== null}
  point={menu ?? { x: 0, y: 0 }}
  onOpenChange={(open) => { if (!open) setMenu(null); }}
  aria-label="Workspace actions"
  items={items}
/>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` | `boolean` | — | **Required.** |
| `point` | `{ x: number; y: number }` | — | **Required.** Viewport coordinates (`clientX` / `clientY`), clamped 8px inside the viewport. |
| `onOpenChange` | `(open: boolean) => void` | — | **Required.** |
| `items` | `readonly ActionMenuItem[]` | — | **Required.** |
| `aria-label` | `string` | `'Actions'` | |
| `className` | `string` | — | Applies to the root menu content. |
| `container` | `HTMLElement \| null` | inherited | Portal target. See [floating content in modals](README.md#floating-content-in-modals). |
| `ref` | | | The root menu content. |

**`ActionMenuItem`**

| Field | Type | Notes |
|---|---|---|
| `id` | `string` | **Required**, and unique among its siblings. |
| `label` | `ReactNode` | **Required.** |
| `icon`, `shortcut` | `ReactNode` | `shortcut` is right-aligned. Format it with [`formatShortcut`](kbd.md). |
| `disabled` | `boolean` | Skipped by the keyboard. |
| `group` | `string` | Neighboring items with the same `group` share one heading. |
| `items` | `readonly ActionMenuItem[]` | Makes the item a submenu. Its `onSelect` is **not** called. |
| `onSelect` | `(event) => void` | Only for items without a submenu. Call `event.preventDefault()` to keep the menu open. |

## Behavior contract

**Onyx owns:** placement with collision handling, focusing the first enabled item, wrapping arrow navigation, Home/End, typeahead, submenus, Escape and outside dismissal, and **returning focus**. After Escape or a selection, focus goes back to whatever had it before, unless the command moved focus somewhere new (an inline rename input, a dialog), in which case that focus is kept. After an outside click, focus stays where the user clicked.

**You supply:** the open state and point, the items (filtered for permissions), running the commands, and keeping item data free of cycles.

## Anatomy

`action-menu` (the root content), then the [Menu](menu.md) slots: `menu-item`, `menu-label`, `menu-shortcut`, `menu-sub-trigger`, `menu-sub-content`.

## Tokens read

The same as [Menu](menu.md).

## Gotchas

- **Use `clientX` / `clientY`**, not `pageX` / `pageY`. The point is in viewport coordinates.
- **Keep `point` when closing.** Close by setting `open` to `false`; replacing `point` while the menu is open moves it.
- **Submenu parents never run `onSelect`.** Put the action on a child item instead.
