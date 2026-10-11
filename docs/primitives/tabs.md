# Tabs

Use when switching related panels without leaving a page. Not for a navigation menu linking unrelated pages.

Anatomy: `tabs`, `tabs-list`, `tabs-trigger`, `tabs-content`, existing `tab-close`, `tab-badge`. Existing `TabList`/`Tab` aliases remain.

`Tabs` keeps `value` / `defaultValue` / `onValueChange` and adds `variant="editor|line"` (editor default) and `asChild`. `TabsTrigger` retains `value`, `disabled` and div markup for compatibility with editor close controls; it now supports `asChild`. Root/list/trigger expose `data-variant`, and trigger/panel expose `data-state="active|inactive"`. Line triggers add a focusable underline treatment for web pages. Tab/panel IDs and `aria-controls` / `aria-labelledby` connect automatically. `TabsContent` accepts `asChild` and keeps `hidden` override behavior.

TabsList uses a single roving tab stop, skips disabled triggers and supports Left/Right/Home/End. Enter/Space activates (manual activation). Existing close/badge API remains. `tabsVariants` and existing `tabTriggerVariants` are exported.

Tokens: line uses `--onyx-space-{0-5,1-5,2}`, `--onyx-border-default`, `--onyx-text-{sm,description,foreground}`, `--onyx-control-focus-ring`, `--onyx-focus-ring-{width,offset}`. Editor chrome retains `--onyx-shell-tabs-*`.

Headless focus behavior uses the shared `useRovingFocus` hook; the existing controlled Tabs value is the state integration API.

All parts forward refs, merge `className`, and expose their `data-slot`. Single-element parts accept `asChild`; provide a single element that forwards its ref. Theme and density inherit from any ancestor. Styling is in `src/styles/collections.css` in `@layer onyx.components`; exported cva functions allow class composition. Geometry, color, focus and motion use public semantic/component tokens.

The tablist owns the single roving tab stop. Arrow keys move focus without selection; controlled selection changes preserve the focused stop while focus remains within the list. When focus leaves, the selected enabled tab becomes the stop (or the first enabled tab if none is selected). TabBadge uses `--onyx-text-xs`.
