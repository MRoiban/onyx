# Text

Text, Heading, SectionLabel, and Code supply shared typography. `HighlightedText` renders literal search matches as `mark` elements without adding a wrapper. Supply `text`, `terms`, optional `caseSensitive`, and `markProps` for application styling. Terms are escaped, empty terms ignored, and the original text and whitespace preserved. Each match exposes `data-slot="text-highlight"`.
