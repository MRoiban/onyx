# Avatar · AvatarGroup

A person's picture, falling back to their initials while the image loads or if it fails. It can show a status dot. `AvatarGroup` overlaps several avatars and collapses the extras into "+N".

**Use when:** representing a user or member next to their content: comments, assignees, presence lists.
**Not for:** the only accessible name of a button (give the button its own `aria-label`), logos or icons (use `<img>` or [Icon](icon.md)), or a status on its own (use [StatusDot](badge.md)).

## Import

```tsx
import { Avatar, AvatarGroup, AvatarImage, AvatarFallback, getAvatarInitials } from '@onyx/ui/avatar';
```

## Example

```tsx
<Avatar name="Ada Lovelace" src={user.photoUrl} status="success" statusLabel="Online" />

<AvatarGroup max={3} aria-label="Collaborators">
  {members.map((m) => <Avatar key={m.id} name={m.name} src={m.photo} size="sm" />)}
</AvatarGroup>
```

## API

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Avatar` | `name` | `string` | — | Used for the initials and the accessible name. |
| | `src`, `alt` | `string` | — | `alt` defaults to `name`. |
| | `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| | `variant` | `'circle' \| 'square'` | `'circle'` | |
| | `status` | `DisplayTone` | — | Adds a status dot, kept outside the image's clipping so its ring stays visible. |
| | `statusLabel` | `string` | — | The dot's accessible name. |
| | children | `AvatarImage`, `AvatarFallback` | | Use these instead of `src` and `name` for full control. |
| `AvatarGroup` | `max` | `number` | unlimited | Avatars beyond `max` become a "+N" avatar, announced as "N more people". |
| | `asChild` | `boolean` | `false` | |

**`getAvatarInitials(name)`** returns the first character of the first and last names, `?` when empty, and handles accents, emoji and flags correctly.

Also exported: `avatarVariants`, `avatarImageVariants`, `avatarFallbackVariants`, `avatarGroupVariants`, `avatarAttributes`.

## Behavior contract

**Onyx owns:** loading the image and falling back to initials (via Radix), working out the initials, overflow in groups, and the status dot.

**You supply:** the name, the image URL and the status.

## Anatomy

`avatar` (`data-size`, `data-variant`), `avatar-image`, `avatar-fallback`, `avatar-status` (`data-tone`), `avatar-group` (`role="group"`).

## Tokens read

`--onyx-avatar-{size,size-sm,size-lg,bg,fg,square-radius}`, `--onyx-avatar-group-overlap`, spacing, radius, status dot and tone tokens.

## Gotchas

- **Give an AvatarGroup an `aria-label`.** Without one, the group has no name for screen readers.
