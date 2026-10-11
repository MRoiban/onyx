# Link

A styled anchor for going to a page or URL. External links open in a new tab and show an "external" icon.

**Use when:** clicking takes the user somewhere: another page, a document, an external site.
**Not for:** actions that change something (use [Button](button.md), or `<Button variant="link">` if it must look like a link), or a breadcrumb trail (use [Breadcrumb](breadcrumb.md)).

## Import

```tsx
import { Link } from '@onyx/ui/link';
```

## Example

```tsx
<Link href="/settings">Settings</Link>
<Link href="https://bedrock.mc2.onl" external>Bedrock dashboard</Link>
<Link variant="muted" href="/help">Help</Link>

{/* with a router */}
<Link asChild><RouterLink to="/files">Files</RouterLink></Link>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `href` | `string` | — | |
| `external` | `boolean` | `false` | Sets `target="_blank"` and `rel="noopener noreferrer"`, and adds the icon. |
| `externalIcon` | `boolean` | `true` | Hides the icon while keeping the external behavior. |
| `variant` | `'default' \| 'muted'` | `'default'` | |
| `target`, `rel` | `string` | derived | Values you set win. `target="_blank"` alone still gets a safe `rel`. |
| `asChild` | `boolean` | `false` | Wrap a router link. The external icon is kept. |
| other | `<a>` props | — | |

Also exported: `linkVariants`.

## Behavior contract

**Onyx owns:** the styling, the external tab behavior, a safe `rel` and the icon.

**You supply:** the destination and the routing.

## Anatomy

`link` (`data-variant`, `data-external`), `link-external-icon`.

## Tokens read

`--onyx-link-color`, `--onyx-text-{link,description}`, type, space and focus tokens.

## Gotchas

- **Link text should describe the destination.** "Read the deployment guide" works on its own; "click here" does not.
