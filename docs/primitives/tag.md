# Tag · TagGroup

Compact chips for selected values, usually with a remove (×) button. `TagGroup` adds keyboard navigation and moves focus to a sensible place after a removal.

**Use when:** showing values the user has chosen and can remove: filters, recipients, labels.
**Not for:** a status label (use [Badge](badge.md)), navigation links, or choosing from options (use [Combobox](combobox.md) with `multiple`, which renders tags for you, or [Toggle Group](toggle-group.md)).

## Import

```tsx
import { Tag, TagGroup, useTagGroup } from '@onyx/ui/tag';
```

## Example

```tsx
const inputRef = React.useRef<HTMLInputElement>(null);

<TagGroup aria-label="Active filters" onEmpty={() => inputRef.current?.focus()}>
  {filters.map((f) => (
    <Tag key={f.id} tone={f.tone} onRemove={() => removeFilter(f.id)}>{f.label}</Tag>
  ))}
</TagGroup>
<Input ref={inputRef} aria-label="Add filter" />
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Tag` | `tone` | `DisplayTone` | `'neutral'` | |
| | `onRemove` | `() => void` | — | Shows the × button. **You** remove the value from your state. |
| | `removeLabel` | `string` | `"Remove <label>"` | Needed when the children are not plain text. |
| | `disabled` | `boolean` | — | Disables the remove button. |
| | `asChild` | `boolean` | `false` | |
| `TagGroup` | `aria-label` | `string` | — | **Required.** |
| | `onEmpty` | `() => void` | — | Called when the last tag is removed, so you can move focus somewhere useful. |
| | `fallbackRef` | `RefObject<HTMLElement>` | — | Receives focus when there is no `onEmpty`, or it doesn't move focus. |

**`useTagGroup({ onEmpty, fallbackRef })`** returns `{ ref, onKeyDown, onFocusCapture, refresh, getItems }` for a custom group.

Also exported: `tagVariants`, `tagGroupVariants`.

## Behavior contract

**Onyx owns:** one tab stop for the group, the arrow keys, removal by keyboard, and **focus after removal**: focus goes to the next tag, or the previous one, then `onEmpty`, then `fallbackRef`, then the group itself. This also works when your state removes the tag later, asynchronously.

**You supply:** the values, and removing them in `onRemove`.

## Keyboard (in a TagGroup)

| Key | Result |
|---|---|
| ← / → / Home / End | Move between tags' remove buttons |
| Enter / Space / Backspace / Delete | Remove the focused tag |

## Anatomy

`tag` (`data-tone`, `data-disabled`, `data-state`), `tag-label`, `tag-remove`, `tag-group` (`role="group"`).

## Tokens read

`--onyx-tag-{height,radius,bg,fg}`, `--onyx-tag-group-gap`, `--onyx-control-secondary-*`, `--onyx-state-active`, tone and focus tokens.

## Gotchas

- **Tags without `onRemove` have nothing to focus,** so TagGroup's keyboard handling doesn't reach them. Read-only tags don't need a TagGroup.
