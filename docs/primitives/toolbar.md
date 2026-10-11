# Toolbar

**Use when:** Group related action controls into one tab stop. **Not for:** A navigation menubar; use Menubar.

## Anatomy

toolbar, toolbar-group, toolbar-button, toolbar-separator. Parts forward refs and merge `className`.

## Props and attributes

Toolbar: `orientation`, `loop`, `asChild`, `dir`, native div props; provide an accessible label. ToolbarButton preserves Button props and adds `tone`: default/active/subtle. Arrow keys follow orientation and direction; Home/End go to endpoints; disabled items are skipped. Text inputs, textareas, editable content, selects and comboboxes retain their own editing keys and separate tab stops. Tab and Shift+Tab move between these widgets and the toolbar action tab stop; arrow navigation and Home/End operate only on the action set. This follows the APG toolbar guidance for controls whose arrow keys serve an editing function.

Parts expose `data-slot`; roots expose relevant `data-size`, `data-variant`, `data-tone`, `data-state`, `data-disabled` and `data-invalid`. User-supplied DOM attributes are forwarded.

## Tokens

All token names below have the `--onyx-` prefix: shell-toolbar-bg, shell-toolbar-border, spacing, control-height-lg; buttons use Button tokens.

## Hooks and variants

`useRovingFocus`; exports `toolbarVariants` and `toolbarButtonVariants`.
