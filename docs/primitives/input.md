# Input

**Use when:** Edit a single line (Input) or multiline text (Textarea). **Not for:** Selecting structured choices; use the relevant collection/field primitive.

## Anatomy

input, textarea. Parts forward refs and merge `className`.

## Props and attributes

`size`: sm/md/lg; `asChild`, native element props. Input omits native numeric size in favor of visual size. Supply an associated label, `aria-describedby`, and `aria-invalid`. Invalid/disabled data attributes mirror native state.

Parts expose `data-slot`; roots expose relevant `data-size`, `data-variant`, `data-tone`, `data-state`, `data-disabled` and `data-invalid`. User-supplied DOM attributes are forwarded.

## Tokens

All token names below have the `--onyx-` prefix: input-height, input-radius, control-height-*, control-input-{bg,fg,border}, control-focus-ring, tone-danger-fg, textarea-min-height, text and spacing tokens.

## Hooks and variants

None; exports `inputVariants`, `textareaVariants`, compatibility `textareaClassName`.
