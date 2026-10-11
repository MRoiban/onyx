# Toolbar

A row of action buttons that forms one keyboard stop: Tab enters the toolbar, and the arrow keys move between its buttons.

**Use when:** grouping related actions above an editor, list or panel (Bold / Italic, Refresh / Collapse all / New file).
**Not for:** application menus such as File / Edit / View (use [Menubar](menubar.md)), a single action (use [Button](button.md)), or a mutually exclusive mode switch (put a [Toggle Group](toggle-group.md) inside the toolbar).

## Import

```tsx
import { Toolbar, ToolbarGroup, ToolbarButton, ToolbarSeparator } from '@onyx/ui/toolbar';
```

## Example

```tsx
<Toolbar aria-label="Explorer actions">
  <ToolbarGroup>
    <ToolbarButton size="icon-sm" aria-label="New file" onClick={newFile}><Icon name="new-file" /></ToolbarButton>
    <ToolbarButton size="icon-sm" aria-label="New folder" onClick={newFolder}><Icon name="new-folder" /></ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarButton tone={filtered ? 'active' : 'subtle'} pressed={filtered} onClick={toggleFilter}>Filter</ToolbarButton>
  <SearchField aria-label="Filter files" />  {/* keeps its own tab stop and editing keys */}
</Toolbar>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Toolbar` | `aria-label` | `string` | — | **Required**, so screen readers can name the toolbar. |
| | `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Sets which arrow keys move between buttons. |
| | `loop` | `boolean` | `true` | Moving past the last button wraps to the first. |
| | `dir` | `'ltr' \| 'rtl'` | `'ltr'` | Reverses Left and Right in right-to-left layouts. |
| | `asChild` | `boolean` | `false` | |
| `ToolbarGroup` | `asChild` | `boolean` | — | A tighter visual group, with no effect on focus. |
| `ToolbarButton` | all [Button](button.md) props except `variant` | | `size: 'sm'` | Always the `ghost` variant. |
| | `tone` | `'default' \| 'active' \| 'subtle'` | `'default'` | `active` shows the selected styling. `subtle` uses muted text. |
| `ToolbarSeparator` | `asChild` | `boolean` | — | A vertical rule. |

Also exported: `toolbarVariants`, `toolbarGroupVariants`, `toolbarButtonVariants`, `toolbarSeparatorVariants`.

## Behavior contract

**Onyx owns:** `role="toolbar"`, keeping one button in the tab order (the [useRovingFocus](README.md#headless-utilities) hook), arrow/Home/End navigation that skips disabled and hidden items, and the toolbar's surface styling.

**You supply:** the label, the buttons, and their actions.

## Keyboard

| Key | Result |
|---|---|
| Tab / Shift+Tab | Enter or leave the toolbar's buttons. Text fields, selects and comboboxes inside the toolbar keep their own tab stops. |
| ← / → (or ↑ / ↓ when vertical) | Move between buttons. |
| Home / End | First / last button. |

## Anatomy

`toolbar` (`data-orientation`), `toolbar-group`, `toolbar-button` (plus Button's attributes and `data-tone`), `toolbar-separator`.

## Tokens read

`--onyx-shell-toolbar-bg`, `--onyx-shell-toolbar-border`, `--onyx-space-{1,2,3,5}`, `--onyx-state-{selected,selected-fg,hover}`, `--onyx-text-{muted,foreground}`, plus Button tokens.

## Gotchas

- **Text fields inside a toolbar keep their arrow keys** for editing and get their own tab stop. Arrow navigation covers only the buttons, as the ARIA Authoring Practices recommend for toolbars.
- **Icon-only buttons need `aria-label`.**
- **The toolbar has a border and background.** To place toolbar controls without them, use `className` or [Inline](layout.md).
