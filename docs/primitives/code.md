# Code

Inline monospaced text in a subtle chip, for identifiers, paths and short code fragments within a sentence.

**Use when:** mentioning `config.json`, a function name or a command inline.
**Not for:** multiline code blocks or editable source (use an editor component), or keyboard shortcuts (use [Kbd](kbd.md)).

## Import

```tsx
import { Code } from '@mroiban/onyx/text';
```

`Code` lives in the Text module and is also exported from the package root.

## Example

```tsx
<Text>Edit <Code>pebble.json</Code> and restart the server.</Text>
<Code asChild><a href="/api/useFieldControl">useFieldControl</a></Code>
```

## API

| Prop | Type | Default | Notes |
|---|---|---|---|
| `asChild` | `boolean` | `false` | |
| other | `<code>` props | — | |

Also exported: `codeVariants`.

## Behavior contract

**Onyx owns:** the monospace font, padding, radius and background.

**You supply:** the text.

## Anatomy

`code`.

## Tokens read

`--onyx-font-mono`, `--onyx-code-padding-x`, `--onyx-code-padding-y`, `--onyx-radius-xs`, `--onyx-control-secondary-bg`, `--onyx-border-subtle`.

## Gotchas

- **Long paths do not wrap well.** Wrap the Code in [Truncate](truncate.md), or allow breaking with `className="break-all"`.
