# Spinner

A small rotating ring that shows something is loading when you can't tell how far along it is.

**Use when:** an operation is running and its progress is unknown.
**Not for:** progress you can measure (use [Progress](progress.md)), a value within a range (use [Meter](meter.md)), placeholder layout while content loads (use [Skeleton](skeleton.md)), or a loading button (use Button's `loading` prop, which draws its own spinner).

## Import

```tsx
import { Spinner } from '@onyx/ui/spinner';
```

## Example

```tsx
<Spinner />                                  {/* announces "Loading" */}
<Spinner size="sm" label="Loading files" />
<span>Syncing <Spinner size="xs" aria-hidden role={undefined} /></span>  {/* decorative */}
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | |
| `label` | `string` | `'Loading'` | The accessible name, through `aria-label`. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | Sets only `data-tone`. The color comes from `currentColor`. |
| `asChild` | `boolean` | `false` | |
| other | `<span>` props | — | |

Also exported: `spinnerVariants`.

## Behavior contract

**Onyx owns:** the animation, sizing, and `role="status"` with a label.

**You supply:** the label, and hiding the spinner from assistive technology when nearby text already says it is loading.

## Anatomy

`spinner` (`data-size`, `data-tone`, `data-state="loading"`).

## Tokens read

`--onyx-spinner-size-{xs,sm,md,lg}`, `--onyx-spinner-width`, `--onyx-spinner-width-xs`, `--onyx-spinner-duration`, `--onyx-radius-full`.

## Gotchas

- **Decorative spinners:** pass `aria-hidden` and `role={undefined}`. Otherwise screen readers announce "Loading" a second time next to your text.
- **To color it, set the text color** (`className="text-[var(--onyx-tone-info-fg)]"`). The `tone` prop alone does not change the color.
