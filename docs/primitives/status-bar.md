# StatusBar

The thin footer bar of a workbench (as in VS Code), holding small status items such as branch, sync state, errors and cursor position.

**Use when:** an app shell needs a persistent footer with status entries.
**Not for:** page footers, toolbars of actions (use [Toolbar](toolbar.md)), or transient messages (use [Toast](toast.md)).

## Import

```tsx
import { StatusBar, StatusBarGroup, StatusBarItem, StatusBarSpacer, statusBarItemVariants } from '@mroiban/onyx/status-bar';
```

## Example

```tsx
<StatusBar>
  <StatusBarGroup>
    <StatusBarItem><Icon name="source-control" /> main</StatusBarItem>
    <StatusBarItem variant={errors ? 'error' : 'default'}><Icon name="error" /> {errors}</StatusBarItem>
  </StatusBarGroup>
  <StatusBarSpacer />
  <StatusBarGroup>
    <button ref={setConnectionAnchor} className={statusBarItemVariants({ variant: 'success' })} onClick={toggleConnection}>
      <StatusDot tone="success" /> Connected
    </button>
    <StatusBarItem>Ln {line}, Col {col}</StatusBarItem>
  </StatusBarGroup>
</StatusBar>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `StatusBar` | `size` | `'sm' \| 'md'` | `'md'` | `md` has a minimum height and padding. `sm` lets a compact host set its own height. Renders a `<footer>`. |
| `StatusBarGroup` | `<div>` props | | | Groups related items. It doesn't impose an order. |
| `StatusBarItem` | `variant` | `'default' \| 'active' \| 'warning' \| 'error' \| 'success'` | `'default'` | A **non-interactive** `<div>`. |
| `StatusBarSpacer` | `<div>` props | | | Pushes the following groups to the right. |

Use `statusBarItemVariants({ variant })` to style a `<button>` as a status item.

## Behavior contract

**Onyx owns:** the bar's surface, item styling and spacing.

**You supply:** the items, their order, and any interactivity (buttons, an [AnchoredPopover](anchored-popover.md) attached to an item).

## Anatomy

`status-bar` (`data-size`), `status-bar-group`, `status-bar-item`, `status-bar-spacer`.

## Tokens read

`--onyx-shell-status-bar-{bg,fg}`, `--onyx-state-{hover,active,warning,error,success}`, `--onyx-radius-sm`.

## Gotchas

- **`StatusBarItem` is not clickable.** For clickable entries, use a real `<button>` with `statusBarItemVariants`, as in the example. That also gives AnchoredPopover a focusable anchor.
