# ActionMenu

Use a controlled command menu when an application opens a menu at a viewport point, such as a named-menu service or a context action. Use `Menu` for ordinary button-triggered menus.

```tsx
import { ActionMenu } from "@onyx/ui/action-menu";

<ActionMenu
  open={menu !== null}
  point={menu ?? { x: 0, y: 0 }}
  onOpenChange={(open) => { if (!open) setMenu(null); }}
  aria-label="Workspace actions"
  items={[
    { id: "open", label: "Open", shortcut: "⌘O", onSelect: openWorkspace },
    { id: "recent", label: "Recent", items: recentActions },
    { id: "remove", label: "Remove", disabled: !canRemove, group: "Workspace" },
  ]}
/>
```

`point` uses viewport coordinates (`clientX`/`clientY`). `items` is a readonly array of `ActionMenuItem`: `id`, `label`, optional `icon`, `shortcut`, `disabled`, `group`, child `items` and `onSelect`. Adjacent items sharing a group have one group heading. An item with children opens a flyout; its selection callback is not run. A leaf's `onSelect` receives the Radix selection event; `preventDefault()` keeps the menu open.

`className`, `aria-label` and the forwarded ref target the root menu content (`data-slot="action-menu"`). `container` overrides the inherited portal container. Child flyouts use `menu-sub-content`; rows, headings and shortcuts use the existing Menu slots and semantic tokens.

Onyx owns collision placement with 8px viewport padding, initial focus, wrapping arrow navigation, Home/End, typeahead, disabled-item skipping, nested flyout navigation, selection and Escape/outside dismissal. Escape and selection restore the invoking focus when it still exists. Outside interaction retains the user's new focus. Applications own visibility state, command execution, item filtering, permissions and prevention of cycles in their menu data.

Closing restores the invoking control only while the menu still owns focus. If a command has focused a new editor, input or dialog, that focus handoff is preserved.
