import { describe, expect, it } from 'vitest';

import { checkboxClassName } from './checkbox';

describe('Checkbox', () => {
  it('uses semantic Onyx control tokens', () => {
    expect(checkboxClassName).toContain('border-[var(--onyx-control-input-border)]');
    expect(checkboxClassName).toContain('bg-[var(--onyx-control-input-bg)]');
    expect(checkboxClassName).toContain('checked:bg-[var(--onyx-control-button-bg)]');
  });
});
