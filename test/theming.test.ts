import { describe, expect, it } from 'bun:test';
import { ONYX_PALETTE, ONYX_SEMANTIC_DARK, ONYX_SEMANTIC_LIGHT } from '../src/theme/tokens';

function luminance(name: string, tokens: Record<string, string>): number {
  let color = tokens[`--onyx-${name}`]!;
  const seen = new Set<string>();
  while (color.startsWith('var(')) {
    if (seen.has(color)) throw new Error(`Cyclic color alias: ${color}`);
    seen.add(color);
    color = tokens[color.slice(4, -1)]!;
  }
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error(`Expected opaque hex color: ${color}`);
  const channels = color.slice(1).match(/../g)!.map(c => parseInt(c, 16) / 255)
    .map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
}
export function contrastRatio(foreground: string, background: string, tokens: Record<string, string>): number {
  const a = luminance(foreground, tokens), b = luminance(background, tokens);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
for (const [theme, semantic] of [['dark', ONYX_SEMANTIC_DARK], ['light', ONYX_SEMANTIC_LIGHT]] as const) {
  describe(`${theme} theme WCAG contrast`, () => {
    const tokens = { ...ONYX_PALETTE, ...semantic };
    const textPairs = [
      ['control-button-fg', 'control-button-bg'],
      ['control-button-fg', 'control-button-hover-bg'],
      ['text-description', 'surface-panel'], ['text-description', 'surface-raised'],
      ['shell-badge-fg', 'shell-badge-bg'],
      ...['neutral', 'info', 'success', 'warning', 'danger'].flatMap(tone => [
        [`tone-${tone}-fg`, `tone-${tone}-bg`], [`tone-${tone}-solid-fg`, `tone-${tone}-solid`],
      ]),
    ];
    for (const [fg, bg] of textPairs) it(`${fg} on ${bg} reaches 4.5:1`, () => {
      expect(contrastRatio(fg!, bg!, tokens)).toBeGreaterThanOrEqual(4.5);
    });
    for (const [fg, bg] of [
      ['control-input-border', 'control-input-bg'],
      ...['surface-app', 'surface-panel', 'surface-raised', 'surface-dialog', 'surface-menu', 'control-input-bg'].map(bg => ['control-focus-ring', bg]),
    ]) it(`${fg} against ${bg} reaches 3:1`, () => {
      expect(contrastRatio(fg!, bg!, tokens)).toBeGreaterThanOrEqual(3);
    });
  });
}
