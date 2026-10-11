# Tree

A keyboard-accessible hierarchical list with expand and collapse, selection, lazy-loaded children, inline rename, drag-and-drop, keyboard cut/paste moves and virtualization. It provides the interaction only: your app supplies the data, such as files.

**Use when:** navigating or selecting nested items: a file explorer, an outline, a settings hierarchy.
**Not for:** flat lists (use [Listbox](listbox.md)), or nested navigation menus (use [Menu](menu.md) submenus). The file model, rename validation and filesystem calls belong to your app; a ready-made file explorer is planned for Gemstone.

## Import

```tsx
import { Tree, useTree, flattenTree, resolveTreeNavigationAction, findTreeTypeAheadMatch } from '@mroiban/onyx/tree';
```

## Example

```tsx
<Tree
  aria-label="Explorer"
  items={rootEntries}
  getKey={(e) => e.path}
  getText={(e) => e.name}
  getChildren={(e) => e.children}                 // undefined = not loaded yet
  isExpandable={(e) => e.kind === 'dir'}
  loadChildren={(e) => fs.list(e.path)}           // fills in missing children
  expandedKeys={expanded}
  onExpandedChange={setExpanded}
  selectionMode="multiple"
  selectedKeys={selected}
  onSelectionChange={setSelected}
  onRename={(e, name) => fs.rename(e.path, name)}
  renderRename={(e, { commit, cancel }) => (
    <Input autoFocus defaultValue={e.name}
      onKeyDown={(ev) => { if (ev.key === 'Enter') commit(ev.currentTarget.value); if (ev.key === 'Escape') cancel(); }} />
  )}
  draggable
  onMoveItem={(sources, target, position) => fs.move(sources, target, position)}
  canMove={(sources, target) => target.item.kind === 'dir' || target.position !== 'inside'}
  virtualized
  renderItem={(e, { expanded }) => (
    <Inline gap="1"><Icon name={e.kind === 'dir' ? (expanded ? 'folder-opened' : 'folder') : 'file'} /><Truncate>{e.name}</Truncate></Inline>
  )}
/>
```

## API

Every [Listbox](listbox.md) option (`items`, `getKey`, `getText`, `isDisabled`, `selectionMode`, `selectedKeys`, `focusedKey`, …), plus:

**Structure and loading**

| Prop | Type | Notes |
|---|---|---|
| `getChildren` | `(item) => readonly T[] \| undefined` | **Required.** Synchronous. `undefined` means not loaded yet. |
| `isExpandable` | `(item) => boolean` | Shows a twisty even before the children load. |
| `expandedKeys` / `defaultExpandedKeys` / `onExpandedChange` | `CollectionKey[]` | Branches expanded on mount load automatically. |
| `loadChildren` | `(item) => Promise<readonly T[]>` | Called when a branch without children is expanded. |
| `onLoadError` | `(error, item) => void` | |

**Rename**

| Prop | Type | Notes |
|---|---|---|
| `onRename` | `(item, name) => void` | Turns on F2 to rename. |
| `renderRename` | `(item, { commit, cancel }) => ReactNode` | **Your** inline editor. It owns its input, validation, Enter and Escape. |
| `renamingKey` / `defaultRenamingKey` / `onRenamingKeyChange` | `CollectionKey \| null` | Start a rename from your code, for example from a context menu. |

**Moving items** (`position` is `'before' | 'inside' | 'after'`)

| Prop | Type | Notes |
|---|---|---|
| `onMoveItem` | `(sourceKeys, targetKey, position) => void` | Turns on keyboard cut/paste, the move action bar, and internal drag-and-drop moves. It is a **request**: update `items` yourself. |
| `canMove` | `(sourceKeys, target) => boolean` | Your model rules. Dropping onto itself, onto a descendant, or onto a disabled row is already rejected. |
| `draggable` | `boolean \| (item) => boolean` | Which rows can be dragged. |
| `canDrop` | `(target, event) => boolean` | Checks every move, including keyboard moves, which receive a synthetic event. Use `canMove` for model rules. |
| `onDropItem` | `(target, event) => void` | Handles pointer drops yourself (including external files). When set, internal drops do **not** call `onMoveItem`. |
| `onDragItem` | `(item, event) => void` | Customize the drag payload. The default is the key as `text/plain`. |
| `dropTarget` / `defaultDropTarget` / `onDropTargetChange` | `TreeDropTarget \| null` | Show the drop indicator from outside the tree. |

**Rendering**

| Prop | Type | Notes |
|---|---|---|
| `renderItem` | `(item, { selected, focused, expanded, loading, depth }) => ReactNode` | The content of each row. Indentation and the twisty are added for you. |
| `virtualized`, `rowHeight`, `overscan` | | For large trees. |
| `onRenderedRangeChange` | `(count, total) => void` | |
| `aria-label` | `string` | **Required.** |
| `asChild` | `boolean` | Pass a custom root as `children`. |

**Headless:** `useTree(options)` returns the Listbox model plus `rows`, `expand(row, open)`, loading, error and rename state, `commitRename`, `getDragProps(row)`, `moveItem`, `cutItem`, `pasteItem`, `cancelMove`, `cutKeys`, `announcement` (render it in a polite live region) and the root and item bindings. `flattenTree(options, expandedKeys)` lists the visible rows, with protection against cycles.

**Pure navigation helpers** (for an app that already owns a flat tree): `resolveTreeNavigationAction(key, { rows, focusedKey, shiftKey })` returns `{ type: 'focus' | 'toggle' | 'activate', key, item, extend? }` or `null`. `findTreeTypeAheadMatch(rows, focusedKey, prefix)` finds the next typeahead match. Each row is a `TreeNavigationItem` `{ key, depth, branch, expanded, label, data, disabled? }`.

Also exported: `treeVariants`. Rows use `TreeRow` and `treeRowVariants` from [Panel](panel.md).

## Behavior contract

**Onyx owns:** the flattened visible rows, the tree ARIA (`aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded`, `aria-busy` while loading), keyboard navigation and typeahead, selection, lazy loading with retry, the rename slot and returning focus after it, drop indicators computed from the pointer position, cut/paste moves with live announcements, and the move action bar.

**You supply:** the data and keys, the row content, the rename editor and its validation, and **performing** renames and moves.

## Keyboard

| Key | Result |
|---|---|
| ↑ / ↓ / Home / End / typing | As in [Listbox](listbox.md) |
| → | Expand, or move to the first child |
| ← | Collapse, or move to the parent |
| `*` | Expand all siblings |
| Enter | Select, and toggle a branch |
| F2 | Rename (with `onRename`) |
| Ctrl/⌘+X | Mark the selection (or the focused row) to move |
| Ctrl/⌘+V | Move **inside** the focused row |
| Ctrl/⌘+Shift+V | Move **before** it |
| Ctrl/⌘+Alt+Shift+V | Move **after** it |
| Escape | Cancel a pending move |

**Moving with a pointer only (WCAG 2.5.7):** when `onMoveItem` is set, a move action bar appears next to the tree. Click a row, then **Cut**, click the target, then **Paste before**, **Paste inside** or **Paste after**. **Cancel move** clears it.

## Anatomy

`tree`, `tree-content`, `tree-virtual-row`, `tree-item` (`data-selected`, `data-focused`, `data-disabled`, `data-depth-guide`, `data-renaming`, `data-cut`, `data-state="loading|expanded|collapsed"`, `data-drop-target`, `data-drop-position`), `tree-twisty`, `tree-rename`, `tree-announcer`, `tree-move-actions`, `tree-move-target`.

## Tokens read

[Listbox](listbox.md) tokens plus `--onyx-tree-indent`, `--onyx-space-{1,3,4}`, `--onyx-border-subtle`, `--onyx-tone-info-bg`, `--onyx-text-md`. `--onyx-tree-depth` is set on each row.

## Gotchas

- **Keys must be unique across the whole tree,** not just among siblings.
- **`loadChildren` should return the same children each time for a given item.** If the whole collection changes (for example a different workspace), remount the Tree with a new `key`.
- **Rejected pastes keep the cut**, so the user can pick another target.
- **Moves don't happen until you update `items`.** Report failed asynchronous moves yourself, for example with a [Toast](toast.md).
