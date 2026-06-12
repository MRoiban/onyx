import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  getProgressPercent,
  Progress,
  progressClassName,
  progressIndicatorClassName
} from './progress';

describe('Progress', () => {
  it('uses semantic Onyx control tokens', () => {
    expect(progressClassName).toContain('bg-[var(--onyx-control-bg)]');
    expect(progressIndicatorClassName).toContain('bg-[var(--onyx-control-focus-ring)]');
  });

  it('clamps progress percentages and aria values', () => {
    expect(getProgressPercent(50, 0, 100)).toBe(50);
    expect(getProgressPercent(150, 0, 100)).toBe(100);
    expect(getProgressPercent(-20, 0, 100)).toBe(0);
    expect(getProgressPercent(1, 1, 1)).toBe(0);

    const html = renderToStaticMarkup(<Progress value={7} min={2} max={12} />);

    expect(html).toContain('data-slot="progress"');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuemin="2"');
    expect(html).toContain('aria-valuemax="12"');
    expect(html).toContain('aria-valuenow="7"');
    expect(html).toContain('data-slot="progress-indicator"');
    expect(html).toContain('width:50%');
  });
});
