# Panel · ListRow · TreeRow

`Panel` is a section surface with a header, body and footer, either as a standalone card or docked into a workbench region. `ListRow` and `TreeRow` are the row styles that Listbox and Tree use, available for your own collections.

**Use when:**
- Panel: a bordered section, or a docked workbench area such as a side panel or bottom panel.
- ListRow / TreeRow: drawing rows in a custom collection that should match Listbox and Tree.

**Not for:** selection or keyboard behavior in collections (use [Listbox](listbox.md), [Tree](tree.md) or their hooks), resizable layout (use [SplitView](split-view.md) or [Sidebar](sidebar.md)), or content tiles (use [Card](card.md)).

## Import

```tsx
import { Panel, PanelHeader, PanelBody, PanelFooter, ListRow, TreeRow } from '@mroiban/onyx/panel';
```

## Example

```tsx
<Panel variant="docked" className="border-t">
  <PanelHeader><SectionLabel>Problems</SectionLabel><Count value={problems.length} /></PanelHeader>
  <PanelBody className="p-0">
    <ScrollArea style={{ height: '100%' }}>
      {problems.map((p) => (
        <ListRow key={p.id} selected={p.id === current} onClick={() => open(p)}>{p.message}</ListRow>
      ))}
    </ScrollArea>
  </PanelBody>
</Panel>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Panel` | `variant` | `'card' \| 'docked'` | `'card'` | `card` is rounded, with a border and shadow. `docked` is flat, clips its content and can shrink to zero width. You add the edge borders. Renders a `<section>`. |
| | `asChild` | `boolean` | `false` | |
| `PanelHeader` / `PanelBody` / `PanelFooter` | `asChild` | | | Header and footer have dividers. The body grows to fill the space and has padding. |
| `ListRow`, `TreeRow` | `selected`, `focused`, `disabled` | `boolean` | | Visual state only. `TreeRow` adds indentation by depth. |
| | `asChild` | `boolean` | `false` | You can override `data-slot` for another collection's anatomy. |

Also exported: `listRowVariants`, `treeRowVariants`.

## Behavior contract

**Onyx owns:** the surfaces, the docked containment (an isolated, clipped region so editors and positioned content can't overflow while resizing), and the row visuals for selected, focused and hover states.

**You supply:** the size, the edge borders for docked panels, and all behavior.

## Anatomy

`panel` (`data-variant`), `panel-header`, `panel-body`, `panel-footer`, `list-row` / `tree-row` (`data-selected`, `data-focused`, `data-disabled`; the older `data-state="active"` still works).

## Tokens read

`--onyx-surface-panel`, `--onyx-border-default`, `--onyx-shadow-sm`, `--onyx-radius-lg`, `--onyx-shell-toolbar-bg` (header), plus the row height, spacing, type, state and focus tokens listed in [Listbox](listbox.md), and `--onyx-tree-indent` for TreeRow.

## Gotchas

- **Floating content inside a docked panel must use a portal.** The panel clips overflow, so a non-portalled dropdown would be cut off. All Onyx overlays already use portals.
- **The body has padding.** Add `className="p-0"` for edge-to-edge lists or editors.
