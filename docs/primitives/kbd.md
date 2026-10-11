# Kbd

A small key-cap chip that shows a keyboard shortcut. `formatShortcut` turns strings like `"cmd+shift+p"` into the right symbols for each platform.

**Use when:** showing a shortcut in a tooltip, a menu, the command palette or help text.
**Not for:** an interactive key or a text input, or code (use [Code](code.md)). Menus and the command palette have their own shortcut slots (`MenuShortcut`, `CommandShortcut`) that take a `formatShortcut()` string.

## Import

```tsx
import { Kbd, formatShortcut } from '@onyx/ui/kbd';
```

## Example

```tsx
<Kbd>{formatShortcut('cmd+k')}</Kbd>                     {/* ⌘K */}
<Kbd>{formatShortcut('cmd+k cmd+s')}</Kbd>               {/* ⌘K ⌘S (a chord) */}
<Kbd>{formatShortcut('ctrl+shift+p', 'windows')}</Kbd>   {/* Ctrl+Shift+P */}

<Tooltip content="Save" shortcut={formatShortcut('cmd+s', platform)}>…</Tooltip>   {/* Tooltip draws the Kbd */}
```

## API

| Item | Signature | Notes |
|---|---|---|
| `Kbd` | `<kbd>` props, `asChild` | A styled `<kbd>`. |
| `formatShortcut(key, platform?)` | `(string, 'mac' \| 'windows' \| 'linux' = 'mac') => string` | Strokes are separated by spaces and keys joined with `+`. Known names: `cmd`, `cmdorctrl`, `ctrl`, `shift`, `alt`, `enter`, `escape`, `tab`, `space`, `backspace`, `delete`, `forwarddelete` and arrow keys. Any other key is uppercased. |

On Mac the result uses symbols (⌘ ⌃ ⇧ ⌥ ↵ ⎋ ⌫ ⌦) with no separators. On Windows it uses readable labels joined with `+` (Win, Ctrl, Shift, Alt), and on Linux the same with Super for `cmd`. `cmdorctrl` becomes ⌘ on Mac and Ctrl elsewhere.

Also exported: `kbdVariants`.

## Behavior contract

**Onyx owns:** the chip styling and formatting. `formatShortcut` never reads browser globals.

**You supply:** the platform. Detect it once in your app and pass it in. The default is `'mac'`.

## Anatomy

`kbd`.

## Tokens read

`--onyx-kbd-height`, `--onyx-kbd-text-size`, `--onyx-radius-xs`, `--onyx-border-default`, `--onyx-surface-panel`, `--onyx-text-muted`, `--onyx-font-family`, `--onyx-weight-semibold`, `--onyx-space-1`.

## Gotchas

- **Cmd+Delete on Mac** formats as ⌫ (Backspace), since that is the actual key. Forward delete is ⌦.
- **Pass the platform.** Without it every user sees Mac symbols.
