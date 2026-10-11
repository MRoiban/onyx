# Sidebar resizing

Use when a sidebar needs a keyboard-accessible resize rail. Not for application pane persistence (use SplitView or persist width in the host).

`SidebarRail` keeps its div ref and HTML props/public `sidebar-rail` slot and now renders ResizeHandle behavior. New optional sizing props: `width`, `defaultWidth` (240), `minWidth` (160), `maxWidth` (800), `onWidthChange`, `disabled`. Without controlled width or callback it observes the nearest Sidebar and applies inline width as it resizes. With `onWidthChange`, the host applies the new width. Right-side rails reverse pointer/key deltas. Collapsing retains the expanded width so the existing context toggle restores it; icon mode retains its original collapsed width. Collapsible Sidebar context enables Enter collapse/restore and updates `open`; `collapsible="none"` preserves an expanded-only region.

WorkbenchSidebar retains its public API and now passes existing `sidebarWidth`, `sidebarMinWidth`, `sidebarMaxWidth`, and `onSidebarWidthChange` into the same ResizeHandle model, including keyboard resizing. Without a width callback its rail is disabled. Pointer-capture resizing avoids global listeners/body mutation; existing injected Sidebar environment continues to own mobile checks. The environment's existing standalone resize helper remains exported for compatibility.

State/ARIA/tokens match ResizeHandle (`data-state`, `data-orientation`, aria values), with `data-slot="sidebar-rail"`. Existing Sidebar slots/exports remain. Headless resizing is available through `useResizable`; `resizeHandleVariants` supplies the visual variant function.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

`ActivityBar` accepts `asChild` to retain a host navigation element and its accessible label.
