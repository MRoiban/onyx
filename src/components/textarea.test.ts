import { describe, expect, it } from 'vitest';

import { textareaClassName } from './textarea';

describe('Textarea', () => {
  it('uses semantic Onyx input tokens', () => {
    expect(textareaClassName).toContain('border-[var(--onyx-control-input-border)]');
    expect(textareaClassName).toContain('bg-[var(--onyx-control-input-bg)]');
    expect(textareaClassName).toContain('text-[var(--onyx-control-input-fg)]');
  });
});
