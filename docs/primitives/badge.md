# Badge · Count · StatusDot

Small, non-interactive status indicators.

| Component | Shows | Example |
|---|---|---|
| `Badge` | A short label with a tone | "Beta", "Failed", "3 new" |
| `Count` | A number in a pill, capped at a maximum | `5`, `99+` |
| `StatusDot` | A colored dot, optionally pulsing | online, running, error |

**Use when:** labeling status, counts or presence next to other content (tab labels, list rows, avatars).
**Not for:** anything clickable (use [Button](button.md) or [Toggle](toggle.md)), removable values (use [Tag](tag.md)), or messages (use [Alert](alert.md) or [Toast](toast.md)).

## Import

```tsx
import { Badge, Count, StatusDot, formatCount, badgeVariants } from '@onyx/ui/badge';
```

## Example

```tsx
<Badge tone="success">Deployed</Badge>
<Badge tone="danger" variant="outline" icon={<Icon name="error" />}>Failed</Badge>

<TabsTrigger value="problems">Problems <Count value={problems.length} tone="danger" /></TabsTrigger>
<Count value={1500} max={999} />                       {/* shows 999+, announces 1500 */}

<StatusDot tone="success" label="Online" />
<StatusDot tone="info" pulse />                          {/* decorative */}

{/* styling your own markup */}
<span className={badgeVariants({ tone: 'warning', variant: 'solid' })}>Draft</span>
```

## API

`DisplayTone` is one of `'neutral' | 'info' | 'success' | 'warning' | 'danger'`.

| Component | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `Badge` | `tone` | `DisplayTone` | `'neutral'` | |
| | `variant` | `'subtle' \| 'solid' \| 'outline'` | `'subtle'` | |
| | `icon` | `ReactNode` | — | Shown before the text. |
| `Count` | `value` | `number` | — | **Required.** Negative and non-finite values show `0`, and decimals are dropped. |
| | `max` | `number` | `99` | Shows `max+` above it. Values below 1 turn the cap off. |
| | `tone`, `variant` | as Badge | `'info'`, `'solid'` | |
| `StatusDot` | `tone` | `DisplayTone` | `'neutral'` | |
| | `pulse` | `boolean` | `false` | The animation stops under reduced motion. |
| | `label` | `string` | — | Makes the dot meaningful (`role="img"`). Without a label it is hidden from screen readers. |
| all | `asChild` | `boolean` | `false` | |

**Helpers:** `formatCount(value, max)` returns the displayed text. `badgeVariants`, `countVariants` and `statusDotVariants` style your own markup. The `displayAttributes(...)` and `badgeAttributes(...)` helpers add the matching data attributes.

## Behavior contract

**Onyx owns:** tone colors, tabular numbers for Count, the full number as Count's accessible name, the pulse animation, and hiding decorative dots.

**You supply:** text that makes sense without color, and a `label` for dots that carry meaning.

## Anatomy

`badge` (`data-tone`, `data-variant`), `badge-icon`, `count` (`data-tone`, `data-variant`), `status-dot` (`data-tone`, `data-state="pulsing|idle"`, `data-pulse`).

## Tokens read

`--onyx-badge-{radius,gap,height,padding,text-size}`, `--onyx-count-{size,text-size,font-weight}`, `--onyx-status-dot-{size,duration}`, `--onyx-tone-*-{bg,fg}`, space, type, weight and radius tokens.

## Gotchas

- **Don't rely on color alone.** A red dot means nothing to colorblind or screen reader users. Add a `label`, or text next to it.
