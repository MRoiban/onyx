# Kbd

**Use when:** displaying a keyboard shortcut. **Not for:** an interactive key or a text input.

Anatomy: `data-slot="kbd"`. `Kbd` forwards its ref, merges `className`, accepts native element props and `asChild`; exports `kbdVariants`.

Tokens: `--onyx-kbd-height`, `--onyx-kbd-text-size`, `--onyx-radius-xs`, `--onyx-border-default`, `--onyx-surface-panel`, `--onyx-text-muted`, `--onyx-font-family`, `--onyx-weight-semibold`, `--onyx-space-1`. No behavioral hook.

`formatShortcut(key, platform = "mac")` formats space-separated chord strokes for keyboard chips. Mac uses modifier symbols and distinguishes Command+Delete from forward Delete; Windows and Linux use readable modifier labels. Pass the intended platform explicitly when formatting shortcuts for other systems.
