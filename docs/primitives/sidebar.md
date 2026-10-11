# Sidebar · ActivityBar · WorkbenchSidebar

The app's side navigation area. Sidebar can collapse or go offcanvas, has a resizable rail, and provides groups and menu buttons. ActivityBar is the narrow icon strip next to it (as in VS Code). WorkbenchSidebar combines the two into a ready-made workbench layout.

**Use when:** an app has a persistent side area for navigation or tool views: explorer, search, settings sections.
**Not for:** a temporary drawer (use [Sheet](sheet.md)), panes that share space with the editor (use [SplitView](split-view.md)), a docked bottom or side panel (use [Panel](panel.md) with `variant="docked"`), or switching views in the sidebar header (pair it with [SectionSelect](section-select.md)).

## Import

```tsx
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarRail,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarGroupAction,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuAction, SidebarMenuBadge,
  SidebarSeparator, SidebarViewHeader, SidebarViewTitle, SidebarMenuSkeleton, useSidebar,
  ActivityBar, ActivityBarItem, ActivityBarSeparator, ActivityBarSpacer, WorkbenchSidebar
} from '@onyx/ui/sidebar';
```

## Example: ready-made workbench

```tsx
<WorkbenchSidebar
  activityBarVisible
  onActivityBarVisibleChange={setActivityBarVisible}
  open={sidebarOpen}
  onOpenChange={setSidebarOpen}
  activityItems={[
    { id: 'files', icon: 'files', label: 'Explorer', isActive: view === 'files', onClick: () => setView('files') },
    { id: 'search', icon: 'search', label: 'Search', isActive: view === 'search', onClick: () => setView('search'), badge: hits }
  ]}
  bottomActivityItems={[{ id: 'settings', icon: 'gear', label: 'Settings', isActive: false, onClick: openSettings }]}
  header={<SectionSelect ariaLabel="Sidebar view" value={view} items={views} onValueChange={setView} />}
  sidebarWidth={width}
  onSidebarWidthChange={setWidth}
>
  {view === 'files' ? <Explorer /> : <SearchView />}
</WorkbenchSidebar>
```

## Example: composed

```tsx
<SidebarProvider collapsible="icon">
  <Sidebar>
    <SidebarHeader><SidebarViewTitle>Project</SidebarViewTitle></SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Pages</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={page === 'home'} onClick={() => go('home')}><Icon name="home" /> Home</SidebarMenuButton>
              <SidebarMenuBadge>3</SidebarMenuBadge>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarRail aria-label="Resize sidebar" />
  </Sidebar>
</SidebarProvider>
```

## API

**`SidebarProvider`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `open` / `defaultOpen` / `onOpenChange` | `boolean` | `true` | Desktop open state. |
| `openMobile` / `defaultOpenMobile` / `onOpenMobileChange` | `boolean` | `false` | Below 768px wide. |
| `side` | `'left' \| 'right'` | `'left'` | |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | `icon` collapses to a 56px icon strip. `none` is always expanded. |
| `environment` | `SidebarEnvironment` | browser globals | Inject `matchMedia` and similar, for tests or iframes. |

**`useSidebar()`** returns `{ state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, side, variant, collapsible }`.

**`Sidebar`** takes `side`, `variant` and `collapsible` overrides. **`SidebarMenuButton`** is a ghost [Button](button.md) with `isActive`. **`SidebarMenuSkeleton`** (`showIcon`) is a loading row.

**`SidebarRail`**

| Prop | Type | Default | Notes |
|---|---|---|---|
| `width` / `defaultWidth` / `onWidthChange` | `number` | `240` | Without `width` or `onWidthChange`, it resizes the nearest Sidebar directly. |
| `minWidth`, `maxWidth` | `number` | `160`, `800` | |
| `disabled` | `boolean` | — | |

**`ActivityBarItem`**: `isActive`, `label` (the accessible name and tooltip), `badge` (number) and button props. `ActivityBar` accepts `asChild` to keep your own `<nav>`.

**`WorkbenchSidebar`**: `activityBarVisible`, `open`, `activityItems` and `bottomActivityItems` (`{ id, icon, label, isActive, onClick, badge? }`), `header`, `footer`, `children`, `sidebarWidth` (`320`), `onSidebarWidthChange`, `sidebarMinWidth` (`200`), `sidebarMaxWidth` (`2000`), `environment`, plus `className`, `headerClassName`, `contentClassName` and `footerClassName`. It renders nothing when both the bar and the sidebar are hidden.

## Behavior contract

**Onyx owns:** the open, collapsed and mobile state, the collapse styling, rail resizing (with [ResizeHandle](resize-handle.md) keyboard behavior, reversed on the right side, and remembering the expanded width across a collapse), and the ActivityBar layout and badges.

**You supply:** the content, which view is active, storing the width, and the toggle controls.

## Keyboard (rail)

The same as [ResizeHandle](resize-handle.md). Enter collapses or restores when the provider is collapsible.

## Anatomy

`sidebar` (`data-state="expanded|collapsed"`, `data-side`, `data-variant`, `data-collapsible`), `sidebar-header`, `sidebar-content`, `sidebar-footer`, `sidebar-group`, `sidebar-group-label`, `sidebar-group-content`, `sidebar-group-action`, `sidebar-menu`, `sidebar-menu-item`, `sidebar-menu-button` (`data-active`), `sidebar-menu-action`, `sidebar-menu-badge`, `sidebar-separator`, `sidebar-rail` (ResizeHandle states), `workbench-sidebar`, plus the ActivityBar slots.

## Tokens read

`--onyx-surface-sidebar`, `--onyx-border-default`, `--onyx-shadow-{sm,md}`, `--onyx-state-{hover,selected,selected-fg}`, `--onyx-radius-md`, plus ResizeHandle tokens.

## Gotchas

- **`useSidebar` throws outside a `SidebarProvider`.**
- **WorkbenchSidebar's rail is disabled without `onSidebarWidthChange`.** Pass it to allow resizing.
- **WorkbenchSidebar doesn't call `onOpenChange` or `onActivityBarVisibleChange` itself.** Toggle `open` and `activityBarVisible` from your own commands, such as an activity item click or a shortcut.
