# Navigation Menu

Website-style top navigation. Each item is a link, or a trigger that opens a panel of related destinations, often laid out as cards.

**Use when:** a site or marketing-style page has top-level sections, some with several sub-pages ("Products ▾" → a grid of product cards).
**Not for:** application commands (use [Menubar](menubar.md) or [Menu](menu.md)), switching panels in place (use [Tabs](tabs.md)), or a breadcrumb trail (use [Breadcrumb](breadcrumb.md)).

## Import

```tsx
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger,
  NavigationMenuContent, NavigationMenuLink, NavigationMenuIndicator
} from '@onyx/ui/navigation-menu';
```

## Example

```tsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="pebbles">
      <NavigationMenuTrigger>Pebbles</NavigationMenuTrigger>
      <NavigationMenuContent>
        <Grid columns={2} gap="2">
          <NavigationMenuLink href="/babel"><strong>Babel</strong><Text tone="description">Translate mods</Text></NavigationMenuLink>
          <NavigationMenuLink href="/nexusboard"><strong>Nexusboard</strong><Text tone="description">Dashboards</Text></NavigationMenuLink>
        </Grid>
      </NavigationMenuContent>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuLink href="/docs" active={path === '/docs'}>Docs</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuIndicator />
  </NavigationMenuList>
</NavigationMenu>
```

## API

Built on [Radix Navigation Menu](https://www.radix-ui.com/primitives/docs/components/navigation-menu).

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `NavigationMenu` | `value` / `defaultValue` / `onValueChange` | `string` | — | The open item. Renders a `<nav>`. |
| | `delayDuration`, `skipDelayDuration`, `orientation` | Radix | `200`, `300`, horizontal | Hover timing. |
| `NavigationMenuItem` | `value` | `string` | generated | |
| `NavigationMenuTrigger` | `asChild` | | — | Opens the item's content on hover or click. |
| `NavigationMenuContent` | `container` | `HTMLElement \| null` | inherited | Positioned below the whole menu bar and as wide as it, with collision handling (8px padding). |
| | `forceMount` | Radix | — | |
| `NavigationMenuLink` | `href`, `active`, `onSelect`, `asChild` | | — | `active` marks the current page (`aria-current`). Use `asChild` with router links. |
| `NavigationMenuIndicator`, `NavigationMenuViewport` | | | | An optional indicator, and Radix's shared viewport. |

Also exported: `navigationMenuVariants`.

## Behavior contract

**Onyx owns:** hover and click disclosure with delays, arrow-key navigation, link focus, and placing the content panel against the menu bar.

**You supply:** the destinations, the routing, and marking the active link.

## Anatomy

`navigation-menu` (`<nav>`), `navigation-menu-list`, `navigation-menu-item`, `navigation-menu-trigger` (`data-state`), `navigation-menu-content` (`data-side`, `data-state`), `navigation-menu-link` (`data-active`), `navigation-menu-indicator`, `navigation-menu-viewport`.

## Tokens read

`--onyx-surface-menu`, `--onyx-border-*`, `--onyx-shadow-md`, `--onyx-z-popover`, `--onyx-radius-*`, `--onyx-space-*`, `--onyx-text-*`, `--onyx-state-selected{,-fg}`, motion tokens.

## Gotchas

- **The content panel is as wide as the whole menu bar**, not the trigger. Design the panel for that width.
- **Give the `<nav>` an `aria-label`** when the page has more than one navigation landmark.
