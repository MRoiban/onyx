# Button

A clickable control that runs an action. It comes in several visual weights and sizes, and it has built-in loading and pressed states.

**Use when:** clicking does something: save, submit, open a dialog, toggle a mode.
**Not for:** going to another page or URL (use [Link](link.md); with `asChild` a Button can wrap a router link if it must look like a button), toggling an independent on/off state that should read as a control (use [Toggle](toggle.md) or [Switch](switch.md)), or choosing one of several pressed options (use [Toggle Group](toggle-group.md)).

## Import

```tsx
import { Button } from '@onyx/ui/button';
```

## Example

```tsx
<Button onClick={save}>Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive" loading={deleting} onClick={remove}>Delete</Button>
<Button variant="ghost" size="icon" aria-label="Close"><Icon name="close" /></Button>
<Button asChild variant="link"><a href="/docs">Read the docs</a></Button>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'default' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive' \| 'link'` | `'default'` | `default` is the primary action. Use one per area. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-xs' \| 'native'` | `'md'` | `default` is an alias for `md`. `icon*` sizes are square. `native` leaves the height to the surrounding workbench. |
| `loading` | `boolean` | `false` | Shows a spinner, keeps the button's width, sets `aria-busy` and blocks activation. |
| `pressed` | `boolean` | — | Sets `aria-pressed` and `data-state="on\|off"`, with the selected styling. |
| `asChild` | `boolean` | `false` | Renders your child element (`<a>`, a router `Link`) with button styling and behavior. |
| `disabled` | `boolean` | — | Native disabled, also blocks clicks on `asChild` children. |
| other | `<button>` props | — | `type` defaults to `"button"`, not `"submit"`. |

Also exported: `buttonVariants({ variant, size })` for styling non-Button elements.

## Behavior contract

**Onyx owns:** the visual variants, a type of `"button"` by default, blocking pointer, keyboard and click activation while loading or disabled (including `asChild` children), keeping the width while loading so the layout does not shift, and the pressed state.

**You supply:** the label, the action, and `aria-label` on icon-only buttons.

## Anatomy

`button` (`data-size`, `data-variant`, `data-state="loading|on|off"`, `data-loading`, `data-disabled`), `button-label`, `button-spinner` (contains a `spinner`).

## Tokens read

`--onyx-button-height`, `--onyx-button-radius`, `--onyx-button-font-weight`, `--onyx-control-height-{xs,sm,md,lg}`, `--onyx-control-{button,secondary,destructive}-{bg,fg,hover-bg}`, `--onyx-border-default`, `--onyx-state-{hover,selected,selected-fg}`, `--onyx-text-{foreground,link}`, `--onyx-space-6`, focus tokens.

## Gotchas

- **Submit buttons need `type="submit"`.** The default is `"button"`, so a Button inside a `<form>` does not submit it unless you say so.
- **Icon-only buttons need `aria-label`.** Keep the [Icon](icon.md) inside decorative.
- **`xs` and `icon-xs` reserve space around themselves.** They look small but keep a pointer target of at least `--onyx-space-6` (24px) by adding a margin of half the difference on every side: 2px per side at compact density and 0 at comfortable. Two of them therefore sit 4px apart even in a row with no gap. Do not remove that margin or use negative spacing, or the targets overlap. They also do not shrink inside flex rows.
- **A button that starts out loading** sizes to fit its content, since there is no earlier width to keep. A width you set yourself always wins.
