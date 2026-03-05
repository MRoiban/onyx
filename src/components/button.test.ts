import { describe, expect, it } from 'vitest';

import { buttonVariants } from './button';

describe('buttonVariants', () => {
  it('uses semantic Onyx tokens for the default button', () => {
    expect(buttonVariants()).toContain('bg-[var(--onyx-control-button-bg)]');
    expect(buttonVariants()).toContain('text-[var(--onyx-control-button-fg)]');
  });

  it('switches to destructive tokens for destructive buttons', () => {
    expect(buttonVariants({ variant: 'destructive' })).toContain(
      'bg-[var(--onyx-control-destructive-bg)]'
    );
  });

  it('supports icon sizing', () => {
    expect(buttonVariants({ size: 'icon' })).toContain('h-9');
    expect(buttonVariants({ size: 'icon' })).toContain('w-9');
  });
});
