# SectionSelect

A title-style switcher. The current section's name appears with a chevron, and clicking it lists the other sections, each with an icon. Typical use is a sidebar header that switches between views such as Explorer, Search and Source Control.

**Use when:** a panel shows one of several peer views and the header itself should switch between them, without a separate tab bar.
**Not for:** form values (use [Select](select.md)), visible side-by-side switching (use [Tabs](tabs.md) or [Toggle Group](toggle-group.md)), or navigating between pages (use links or [Navigation Menu](navigation-menu.md)).

## Import

```tsx
import { SectionSelect, type SectionSelectItem } from '@mroiban/onyx/section-select';
```

## Example

```tsx
type View = 'explorer' | 'search' | 'git';

const views: readonly SectionSelectItem<View>[] = [
  { value: 'explorer', icon: 'files', label: 'Explorer' },
  { value: 'search', icon: 'search', label: 'Search' },
  { value: 'git', icon: 'source-control', label: 'Source Control' }
];

<SectionSelect
  ariaLabel="Sidebar view"
  value={view}
  items={views}
  onValueChange={setView}
/>
```

`TValue` is inferred from `items`, so `onValueChange` receives the `View` union and needs no cast.

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `TValue extends string` | — | **Required, and always controlled.** |
| `items` | `readonly { value; icon; label }[]` | — | **Required.** `icon` is a [Codicon](icon.md) name. |
| `onValueChange` | `(value: TValue) => void` | — | **Required.** |
| `ariaLabel` | `string` | — | **Required.** Labels both the trigger and the list. |
| `open`, `onOpenChange` | `boolean`, `(open) => void` | uncontrolled | Control the menu, for example to open it from a shortcut. |
| `triggerId`, `valueId` | `string` | — | Ids for the trigger and its label span, so other elements can reference them with `aria-labelledby`. |
| `triggerClassName`, `contentClassName` | `string` | — | |
| `environment` | `SectionSelectEnvironment` | globals | Supply `window`, `document`, `requestAnimationFrame` or `getSelection`, for iframes or tests. |

Also exported: `getSectionSelectMenuPosition(rect, viewport, scale)`, `createSectionSelectEnvironment(env)` and `retainSectionSelectDocumentSelectionLock(doc, env)`.

## Behavior contract

**Onyx owns:** the borderless trigger with a chevron that rotates when open, a body-portalled list placed below the trigger (at least 224px wide, kept 8px inside the viewport and repositioned on scroll and resize), focusing the selected item when it opens, keyboard navigation, closing on Escape, Tab or an outside click, returning focus to the trigger after a choice, and **blocking text selection across the document while the menu is open**, so dragging over it cannot highlight sidebar text.

**You supply:** the sections, the current value, and rendering the chosen view.

## Keyboard

| Where | Key | Result |
|---|---|---|
| Trigger | Enter / Space / ↓ / ↑ | Open with the selected item focused |
| List | ↑ / ↓ / Home / End | Move, wrapping around |
| List | Enter / Space | Choose the item and close |
| List | Escape | Close and refocus the trigger |
| List | Tab | Close |

## Anatomy

`section-select-trigger` (`role="combobox"`, `data-state="open|closed"`), `section-select-content` (`role="listbox"`), `section-select-item` (`role="option"`, `aria-selected`, `data-active`), `section-select-item-leading`. While the menu is open, `body` has the class `onyx-section-select-open`.

## Tokens read

`--onyx-surface-menu`, `--onyx-border-default`, `--onyx-shadow-md`, `--onyx-radius-{sm,md}`, `--onyx-text-foreground`, `--onyx-text-muted`, `--onyx-state-{hover,selected,selected-fg}`, `--onyx-control-focus-ring`, `--onyx-z-popover`, `--onyx-scale-ui` (also read at runtime to scale the gap and minimum width).

## Gotchas

- **Always portalled to `document.body`.** Unlike the Radix-based overlays, SectionSelect does not move into a surrounding Dialog. Avoid using it inside modals.
- **It only opens downward.** The list's height is limited to the space below the trigger, so place SectionSelect near the top of its panel.
- **An unknown `value` falls back** to showing the first item's label. It does not throw.
