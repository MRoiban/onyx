# Onyx primitives

Onyx supplies opinionated defaults with full control afterwards. Source is owned by the consumer; parts forward refs, merge classes, and expose `data-slot` and relevant state/variant/size/tone attributes. Many primitives expose a headless hook for custom rendering; each primitive page identifies its available hook or state model. Switch uses its native input directly and has no separate hook; Tabs documents its controlled state model.

## Index

Each page covers when to use the primitive, its anatomy (`data-slot` parts), props and data attributes, the tokens it reads and any available headless hook or state model. Build history lives in [reports/](reports/).

### Foundations & actions

| Primitive | Use when |
|---|---|
| [Theme](theme.md) | Scope an Onyx theme or density, or override tokens |
| [Button](button.md) | Invoke an action |
| [Spinner](spinner.md) | An operation is in progress |
| [Input](input.md) | Edit a single line (Input) or multiline text (Textarea) |
| [Toolbar](toolbar.md) | Group related action controls into one tab stop |
| [Text](text.md) | Shared typography and literal search highlighting |
| [Code](code.md) | Showing an inline identifier, path or code fragment |
| [Kbd](kbd.md) | Displaying a keyboard shortcut |
| [Toggle](toggle.md) | A compact independent pressed action is needed |
| [Toggle Group](toggle-group.md) | Segmented actions select one or multiple pressed values |
| [Link](link.md) | Navigating to a resource |

### Overlays

| Primitive | Use when |
|---|---|
| [Popover](popover.md) | Anchored interactive settings or workspace controls |
| [ActionMenu](action-menu.md) | State-controlled commands opened at a viewport point |
| [AnchoredPopover](anchored-popover.md) | Attach an interactive surface to an existing external control |
| [Menu](menu.md) | Button-triggered commands, checks and mutually exclusive command choices |
| [Tooltip](tooltip.md) | Short noninteractive explanations and keyboard shortcuts |
| [Truncate](truncate.md) | Long names or paths in constrained rows |
| [Hover Card](hover-card.md) | Supplementary profile or object previews on hover/focus |
| [Alert Dialog](alert-dialog.md) | An explicit irreversible or destructive decision |
| [Sheet](sheet.md) | Supplementary forms, filters or mobile drawers |
| [Menubar](menubar.md) | Application command categories such as File/Edit/View |
| [Navigation Menu](navigation-menu.md) | Site navigation with related destination cards |
| [Combobox](combobox.md) | Searchable choices, creation flows or multiple selections |
| [Date Picker](date-picker.md) | Single date or date-range selection with a calendar popup |

### Forms

| Primitive | Use when |
|---|---|
| [Field](field.md) | A control needs a label, guidance or validation |
| [Input Group](input-group.md) | An input has a prefix, suffix or embedded action |
| [Search Field](search-field.md) | Text search needs a clear action or find toggles |
| [Number Field](number-field.md) | Bounded numeric entry needs typed text and steppers |
| [Radio Group](radio-group.md) | Exactly one mutually exclusive choice is needed |
| [Checkbox Group](checkbox-group.md) | Multiple native checkbox values need a shared selection model |
| [Slider](slider.md) | A numeric amount or interval is easier to choose by adjustment |
| [OTP Field](otp-field.md) | A short verification code needs distinct cells |
| [Password Field](password-field.md) | Secret entry needs a reveal control |
| [Color Swatch](color-swatch.md) | A color sample or a palette choice is needed |
| [Color Picker](color-picker.md) | HSV color editing and hexadecimal entry are needed |
| [Calendar](calendar.md) | One date or an inclusive date range must be selected |
| [File Trigger](file-trigger.md) | A button opens a native file dialog |
| [Drop Zone](drop-zone.md) | Local files need drop acceptance and keyboard browsing |

### Feedback & display

| Primitive | Use when |
|---|---|
| [Badge · Count · StatusDot](badge.md) | Compact status, numeric counts, or presence |
| [Tag · TagGroup](tag.md) | Removable selected values |
| [Alert](alert.md) | Inline or banner feedback without moving focus |
| [Card](card.md) | A grouped content surface |
| [Avatar · AvatarGroup](avatar.md) | Representing people with image or initials |
| [Skeleton](skeleton.md) | A predictable loading placeholder |
| [Meter](meter.md) | A measurement in a meaningful bounded range |
| [Progress](progress.md) | Determinate or indeterminate task completion |
| [Separator](separator.md) | Dividing groups with optional text |
| [Breadcrumb](breadcrumb.md) | Showing hierarchy and the current page |
| [Toast queue](toast.md) | Transient feedback with optional action |
| [EmptyState](empty-state.md) | A content area has nothing to display |

### Collections & structure

| Primitive | Use when |
|---|---|
| [Listbox](listbox.md) | Choosing one or several options in a collection |
| [Tree](tree.md) | Navigating/selecting generic hierarchical items |
| [Fixed Virtual List](fixed-virtual-list.md) | Fixed-height rows in an existing ancestor or explicit scrolling viewport |
| [VirtualList](virtual-list.md) | A scroll viewport should mount only visible rows from a large flat collection |
| [OverlayScrollbar](overlay-scrollbar.md) | Attach shared scrollbar behavior to an existing scrolling viewport |
| [StatusBar](status-bar.md) | Group workbench status contributions in a footer |
| [ScrollArea](scroll-area.md) | A native scrolling viewport needs an overlay scrollbar and optional edge shadows |
| [ResizeHandle](resize-handle.md) | A separator changes the size of an adjacent region |
| [SplitView](split-view.md) | Adjacent panes share a constrained resizable area, including nested horizontal/vertical editor layouts |
| [Collapsible](collapsible.md) | Independently revealing optional content |
| [Accordion](accordion.md) | Organizing expandable sections with single or multiple expansion |
| [Tabs](tabs.md) | Switching related panels without leaving a page |
| [Table](table.md) | Presenting ordinary semantic tabular data |
| [Pagination](pagination.md) | Navigating pages of results |
| [Carousel](carousel.md) | Horizontally paging a small set of related slides |
| [Panel rows](panel.md) | Rendering a styled collection row or composing a panel |
| [Sidebar resizing](sidebar.md) | A sidebar needs a keyboard-accessible resize rail |

### Layout

| Primitive | Use when |
|---|---|
| [Stack · Inline · Container · Grid](layout.md) | Layout and spacing should work without application CSS |

## Theming

Import `@onyx/ui/styles.css` and include Onyx source in your Tailwind 3 content list; no extra PostCSS step is required. See [Theme](theme.md) for setup.

Use `OnyxThemeRoot` or `data-theme="dark|light"` and `data-density="compact|comfortable"` on any ancestor. Omitted root props inherit. Body portals inherit the document root; synchronize those attributes on `<html>` when needed.

1. Palette (`--onyx-palette-*`) holds raw Flexoki colors.
2. Semantic tokens (`--onyx-surface-*`, `--onyx-text-*`, borders, tones, space, type, motion, focus and layers) switch at theme/density boundaries.
3. Component tokens (`--onyx-button-radius`, `--onyx-input-height`, etc.) have defaults resolved **at their point of use**, against the nearest semantic tokens. An ancestor component override survives nested theme roots and theme/density boundaries. A closer explicit override wins.

`variables` accepts registered camelCase keys, registered exact CSS names, and the typed `--onyx-${string}` escape hatch. Example: `<OnyxThemeRoot density="comfortable" variables={{ paletteBlue600: '#A02F6F', buttonRadius: '999px', '--onyx-consumer-extension': '1' }}>…</OnyxThemeRoot>`. Inline overrides win. Palette or semantic variables rebind their dependent aliases even when `theme` is omitted; independently overridden inherited aliases and explicit alias values remain intact. This alias rebinding uses modern CSS `@scope` and custom-property style queries. Plain CSS palette replacements belong on an explicit theme boundary; the automatic dependency flag is supplied by `OnyxThemeRoot`'s `variables` prop.

Compact heights are 20/24/28/32px; comfortable heights are 24/30/36/40px. `default` Button size remains an alias for `md`; `native` leaves height to the workbench. Existing shell, state-warning/error/success, scale, radius and layer names remain available. Instance geometry/state variables (for example tree depth, toast index and color-picker hue) are private; they are distinct from public theme tokens.

All library rules, including responsive/state utilities and portable animations, live in `onyx.base` or `onyx.components`. Unlayered application CSS wins. `className` is merged with `cn`; parts expose `data-slot` and size, variant, tone, state and ARIA hooks. All used keyframes and animation classes ship in CSS even with a consumer's own Tailwind config. The exported `tailwind.preset.cjs` additionally makes the named animations available for new consumer utilities. Reduced motion collapses animation/transition durations.

## Headless utilities

Import from `@onyx/ui/hooks` (also the root): `useControllableState`, `useRovingFocus`, `composeRefs`, `useComposedRefs`, `useFloatingPosition`. Radix `VisuallyHidden` and `Portal` are exported at the root and their respective subpaths.

- `useControllableState({value, defaultValue, onChange})` returns `[value, setValue]`, with functional updates and controlled/uncontrolled behavior.
- `useRovingFocus({orientation, loop, dir, selector})` returns `ref`, `onKeyDown`, `onFocusCapture`, `refresh`, `getItems`. Attach the ref and event handlers to your group root. It skips disabled/hidden/inert items, tracks dynamic children, supports arrows and Home/End, and preserves input editing keys. Call `refresh` for custom visibility changes.
- `useFloatingPosition({open, placement, offset, matchWidth, arrowRef})` returns Floating UI's refs/styles/middleware data. It uses autoUpdate, flip, shift with 8px padding, size constraints and optional arrow positioning. It owns positioning only; consumers own open state, dismissal, focus and ARIA wiring.
- `composeRefs` and `useComposedRefs` retain React 19 callback-ref cleanup.

## Development

`bun install`; `bun run gallery` serves port 4816 and watches Tailwind source. `bun run build:css` rebuilds gallery CSS/assets. `bun run typecheck` and `bun test` validate the library and registry. Tests preload happy-dom.

Workstreams put CSS inside `@layer onyx.components` in `src/styles/{overlays,forms,collections,display}.css`, already imported by globals. The matching gallery section has a default component export. Shared manifest, index, registry, tokens, globals and Tailwind config belong to W0/orchestrator.

W2 also fills the named `FormsActions` export in its gallery file; W4 fills `DisplayActions`. These are rendered in section 2 by the scaffold, so neither workstream needs to edit the app or foundations file.
