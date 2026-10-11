# Command

A searchable list of actions, filtered as you type. `CommandDialog` puts that list in a centered palette, like VS Code's <kbd>⌘</kbd><kbd>Shift</kbd><kbd>P</kbd>.

**Use when:** users run actions or jump to items by name, either in a command palette or in an inline searchable action list.
**Not for:** choosing a form value (use [Combobox](combobox.md) or [Select](select.md)), commands opened from a button (use [Menu](menu.md)), or a large list of records that needs virtualization (use [Listbox](listbox.md) with [VirtualList](virtual-list.md)).

## Import

```tsx
import {
  CommandDialog, Command, CommandInput, CommandList, CommandEmpty,
  CommandGroup, CommandItem, CommandSeparator, CommandShortcut
} from '@mroiban/onyx/command';
import { formatShortcut } from '@mroiban/onyx/kbd';
```

## Example

```tsx
function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange(open: boolean): void }) {
  const run = (action: () => void) => () => {
    onOpenChange(false);
    action();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command…" />
      <CommandList>
        <CommandEmpty>No matching commands.</CommandEmpty>
        <CommandGroup heading="File">
          <CommandItem onSelect={run(newFile)} keywords={['create']}>
            New File
            <CommandShortcut>{formatShortcut('cmd+n')}</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={run(save)}>Save</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="View">
          <CommandItem onSelect={run(toggleSidebar)}>Toggle Sidebar</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
```

Use `<Command>` without `CommandDialog` to embed the same list inline, for example in a popover or panel.

## API

Built on [cmdk](https://cmdk.paco.me). Every cmdk prop passes through. The props below are the ones you will usually set.

| Part | Prop | Type | Default | Notes |
|---|---|---|---|---|
| `CommandDialog` | `open`, `onOpenChange` | Radix Dialog | — | You own the open state and the keyboard shortcut that opens it. |
| | `modal` | `boolean` | **`false`** | The palette is non-modal by default, so the page behind it stays interactive. |
| | `shouldFilter` | `boolean` | `true` | Set to `false` when you filter or fetch results yourself. |
| `Command` | `value`, `onValueChange` | `string` | — | The highlighted item (cmdk). |
| | `filter`, `shouldFilter`, `loop` | cmdk | — | Use these to rank items yourself or to wrap arrow navigation. |
| `CommandInput` | `value`, `onValueChange`, `placeholder` | `string` | — | `className` applies to the `<input>`, not to its shell. |
| `CommandGroup` | `heading` | `ReactNode` | — | Groups hide themselves when none of their items match. |
| `CommandItem` | `onSelect` | `(value: string) => void` | — | Fires on Enter or click. |
| | `value` | `string` | text content | Give every item a unique `value` when labels can repeat. |
| | `keywords` | `string[]` | — | Extra terms that match without being displayed. |
| | `disabled` | `boolean` | — | The item is skipped and drawn at 40% opacity. |
| `CommandShortcut` | span props | — | — | Right-aligned hint. Pass it a `formatShortcut()` string or [Kbd](kbd.md) chips. |

## Behavior contract

**Onyx owns:** filtering and ranking, arrow/Home/End navigation, Enter to run, item highlighting (`aria-selected`), hiding empty groups, the visually hidden dialog title and description, sizing (the list is capped at 420px or 60vh) and UI scaling.

**You supply:** the commands and what they do, the open state, the global shortcut that opens the palette, and closing it after an action runs. `onSelect` does not close the dialog.

## Anatomy

`command`, `command-input-shell` (search icon and bottom divider), `command-input`, `command-list`, `command-empty`, `command-group`, `command-separator`, `command-item`, `command-shortcut`. cmdk also adds `[cmdk-*]` attributes, such as `[cmdk-group-heading]`, and `data-selected`/`data-disabled` on items.

## Tokens read

`--onyx-surface-menu`, `--onyx-surface-dialog`, `--onyx-border-default`, `--onyx-shadow-lg`, `--onyx-text-{foreground,muted,description}`, `--onyx-state-selected{,-fg}`, `--onyx-radius-{sm,md}`, `--onyx-scale-ui`.

## Gotchas

- **The search row draws no focus ring, on purpose.** Focus stays in the input while you navigate, and the highlighted item shows where you are. Do not add a ring through `className`.
- **`CommandDialog` is non-modal.** Pass `modal` if the page behind it must be inert.
- **Items with the same text need a `value`.** cmdk uses the text content as the item's identity, so two items labeled "Open" collide unless each has its own `value`.
- **Async results:** set `shouldFilter={false}` and render the server's results, or cmdk will filter them again on the client.
