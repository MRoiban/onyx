# Tabs

A row of tabs, each showing its own panel. Comes in two styles: `editor` (VS Code-like file tabs that can have close buttons and badges) and `line` (underlined web-page tabs).

**Use when:** related panels share one space and users switch between them without leaving the page: open files, Settings › General / Advanced, Output / Problems / Terminal.
**Not for:** links to different pages (use [Navigation Menu](navigation-menu.md) or [Link](link.md)), switching a view mode or filter in a toolbar (use [Toggle Group](toggle-group.md)), or a panel header that switches views (use [SectionSelect](section-select.md)).

## Import

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent, TabClose, TabBadge } from '@onyx/ui/tabs';
```

## Example

```tsx
{/* editor tabs */}
<Tabs value={activeFile} onValueChange={setActiveFile}>
  <TabsList aria-label="Open files">
    {files.map((f) => (
      <TabsTrigger key={f.path} value={f.path}>
        <Truncate>{f.name}</Truncate>
        {f.dirty && <TabBadge>●</TabBadge>}
        <TabClose aria-label={`Close ${f.name}`} onClick={() => closeFile(f.path)}><Icon name="close" /></TabClose>
      </TabsTrigger>
    ))}
  </TabsList>
  {files.map((f) => <TabsContent key={f.path} value={f.path}><Editor file={f} /></TabsContent>)}
</Tabs>

{/* page tabs */}
<Tabs variant="line" defaultValue="general">
  <TabsList aria-label="Settings sections">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>
  <TabsContent value="general">…</TabsContent>
  <TabsContent value="advanced">…</TabsContent>
</Tabs>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Tabs` | `value` / `defaultValue` / `onValueChange` | `string` | — | |
| | `variant` | `'editor' \| 'line'` | `'editor'` | |
| | `asChild` | `boolean` | `false` | |
| `TabsList` | `aria-label` | `string` | — | Recommended. |
| `TabsTrigger` | `value` | `string` | — | **Required.** Renders a `<div role="tab">`, so it can hold a close button. |
| | `disabled`, `asChild` | | | |
| `TabsContent` | `value` | `string` | — | **Required.** Inactive panels are `hidden`; you can override `hidden`. |
| | `asChild` | `boolean` | | |
| `TabClose` | `<button>` props | | | A ghost icon button. It stops click propagation so the tab doesn't activate. Needs `aria-label`. |
| `TabBadge` | `<span>` props | | | A small pill, for a dirty marker or a count. |

`TabList` and `Tab` are aliases of `TabsList` and `TabsTrigger`. Also exported: `tabsVariants`, `tabTriggerVariants`.

## Behavior contract

**Onyx owns:** connecting tabs and panels (`aria-controls` and `aria-labelledby`), one tab stop for the list, arrow-key focus with manual activation, skipping disabled tabs, and both styles.

**You supply:** which tab is active, closing tabs, and rendering the panels.

## Keyboard

| Key | Result |
|---|---|
| ← / → / Home / End | Move focus between tabs (doesn't activate them) |
| Enter / Space | Activate the focused tab |

When focus leaves the list, the selected tab becomes its tab stop again.

## Anatomy

`tabs` (`data-variant`), `tabs-list`, `tabs-trigger` (`data-state="active|inactive"`, `data-variant`), `tabs-content` (`data-state`), `tab-close`, `tab-badge`.

## Tokens read

Line style: `--onyx-space-{0-5,1-5,2}`, `--onyx-border-default`, `--onyx-text-{sm,description,foreground}`, focus tokens. Editor style: `--onyx-shell-tabs-*`, `--onyx-shell-badge-{bg,fg}`, `--onyx-text-xs`.

## Gotchas

- **Activation is manual.** Arrow keys only move focus, so heavy panels don't render as users move past them. Press Enter or Space to switch.
