import { describe, expect, it } from 'vitest';

import { tabTriggerVariants } from './tabs';

describe('tabTriggerVariants', () => {
  it('renders active tab chrome with semantic shell tokens', () => {
    const classes = tabTriggerVariants({ active: true });

    expect(classes).toContain('border-[var(--onyx-shell-tabs-border)]');
    expect(classes).toContain('bg-[var(--onyx-surface-panel)]');
  });

  it('renders inactive tabs with hover affordance', () => {
    const classes = tabTriggerVariants({ active: false });

    expect(classes).toContain('hover:bg-[var(--onyx-state-hover)]');
    expect(classes).toContain('text-[var(--onyx-text-description)]');
  });
});
