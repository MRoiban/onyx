import { describe, expect, it } from 'vitest';

import { switchThumbClassName, switchTrackClassName } from './switch';

describe('Switch', () => {
  it('uses semantic Onyx control tokens', () => {
    expect(switchTrackClassName).toContain('bg-[var(--onyx-control-input-border)]');
    expect(switchTrackClassName).toContain('data-[state=checked]:bg-[var(--onyx-control-button-bg)]');
    expect(switchThumbClassName).toContain('bg-[var(--onyx-control-button-fg)]');
  });
});
