import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  formatNumberEffectValue,
  normalizeNumberEffectValue,
  NumberEffect,
  numberEffectClassName,
  resolveNumberEffectDirection
} from './number-effect';

describe('NumberEffect', () => {
  it('normalizes and resolves number transitions', () => {
    expect(normalizeNumberEffectValue(Number.NaN)).toBe(0);
    expect(resolveNumberEffectDirection(17, 27)).toBe('up');
    expect(resolveNumberEffectDirection(27, 17)).toBe('down');
    expect(resolveNumberEffectDirection(27, 17, 'up')).toBe('up');
    expect(formatNumberEffectValue(7, (value) => value.toString().padStart(2, '0'))).toBe('07');
  });

  it('renders a semantic reusable number effect shell', () => {
    const html = renderToStaticMarkup(
      <NumberEffect value={17} className="sidebar-count" />
    );

    expect(html).toContain('data-slot="number-effect"');
    expect(html).toContain('data-value="17"');
    expect(html).toContain('aria-label="17"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain(numberEffectClassName);
    expect(html).toContain('sidebar-count');
  });
});
