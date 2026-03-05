import { describe, expect, it } from 'vitest';

import { statusBarItemVariants } from './status-bar';

describe('statusBarItemVariants', () => {
  it('renders warning state variants with the warning token', () => {
    expect(statusBarItemVariants({ variant: 'warning' })).toContain(
      'text-[var(--onyx-state-warning)]'
    );
  });

  it('renders active state variants with the active shell treatment', () => {
    expect(statusBarItemVariants({ variant: 'active' })).toContain('bg-white/14');
  });
});
