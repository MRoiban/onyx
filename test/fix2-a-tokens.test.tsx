import { describe, expect, it } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { resolveChromium } from './browser';
import { ONYX_SEMANTIC_DARK, ONYX_SEMANTIC_LIGHT, ONYX_THEME_VARIABLES } from '../src/theme/tokens';
const require = createRequire(import.meta.url);
const postcss = require('postcss');
const css = () => postcss.parse(readFileSync('src/styles/globals.css', 'utf8'));

describe('R18 shared Chromium discovery', () => {
  it('prefers ONYX_CHROMIUM and discovers arbitrary macOS and Linux revisions', () => {
    const home = mkdtempSync(join(tmpdir(), 'onyx-browser-discovery-'));
    try {
      const explicit = join(home, 'custom-chromium');
      writeFileSync(explicit, '');
      expect(resolveChromium({ home, env: { ONYX_CHROMIUM: explicit } })).toBe(explicit);
      for (const cache of ['Library/Caches/ms-playwright', '.cache/ms-playwright']) {
        const root = join(home, cache, 'chromium_headless_shell-9999', 'chrome-headless-shell-platform');
        mkdirSync(root, { recursive: true });
        const binary = join(root, 'chrome-headless-shell');
        writeFileSync(binary, '');
        expect(resolveChromium({ home, env: {} })).toBe(binary);
        rmSync(join(home, cache), { recursive: true });
      }
    } finally { rmSync(home, { recursive: true, force: true }); }
  });
  it('fails clearly in CI without Chromium and only permits local skipping', () => {
    const home = mkdtempSync(join(tmpdir(), 'onyx-no-browser-'));
    try {
      expect(resolveChromium({ home, env: {} })).toBeUndefined();
      expect(() => resolveChromium({ home, env: { CI: '1' } })).toThrow('Onyx browser tests require Chromium in CI');
      expect(() => resolveChromium({ home, env: { ONYX_CHROMIUM: join(home, 'missing') } })).toThrow('ONYX_CHROMIUM does not exist');
    } finally { rmSync(home, { recursive: true, force: true }); }
  });
});

describe('R19 token and animation source parity', () => {
  it('semantic rebinding scopes cover exactly each theme alias relationship', () => {
    const scopes: any[] = [];
    css().walkAtRules('scope', (rule: any) => scopes.push(rule));
    expect(scopes.map(rule => rule.params)).toEqual(['(:root) to ([data-theme])', "([data-theme='dark']) to ([data-theme])", "([data-theme='light']) to ([data-theme])"]);
    scopes.forEach((scope, index) => {
      const map = index === 2 ? ONYX_SEMANTIC_LIGHT : ONYX_SEMANTIC_DARK;
      const aliases = Object.entries(map).filter(([, value]) => value.includes('var('));
      expect(scope.nodes.map((rule: any) => rule.params)).toEqual(aliases.map(([name, value]) => `style(${name}: ${value})`));
      scope.nodes.forEach((query: any, i: number) => {
        const [name, value] = aliases[i]!;
        expect(query.nodes.length).toBe(1);
        expect(query.nodes[0].selector).toBe(`[data-onyx-rebind~="${name}"]`);
        expect(query.nodes[0].nodes.map((decl: any) => [decl.prop, decl.value])).toEqual([[name, value]]);
      });
    });
  });
  it('globals defines each keyframe and animation class once and the preset mirrors them', () => {
    const root = css();
    const frames: Record<string, any> = {};
    const animations: Record<string, string> = {};
    root.walkAtRules('keyframes', (rule: any) => {
      expect(frames[rule.params], rule.params).toBeUndefined();
      frames[rule.params] = Object.fromEntries(rule.nodes.map((step: any) => [step.selector, Object.fromEntries(step.nodes.map((decl: any) => [decl.prop.replace(/-([a-z])/g, (_: string, char: string) => char.toUpperCase()), decl.value]))]));
    });
    root.walkRules((rule: any) => {
      if (!/^\.animate-[\w-]+$/.test(rule.selector)) return;
      rule.walkDecls('animation', (decl: any) => {
        const name = rule.selector.slice('.animate-'.length);
        expect(animations[name], name).toBeUndefined();
        animations[name] = decl.value;
      });
    });
    const preset = require('../tailwind.preset.cjs').theme.extend;
    for (const [name, value] of Object.entries(preset.keyframes)) expect(frames[name], name).toEqual(value);
    expect(animations).toEqual(preset.animation);
  });
});

it('R20 removes the unread checkboxIndicator public token', () => {
  expect('checkboxIndicator' in ONYX_THEME_VARIABLES).toBe(false);
  expect(Object.values(ONYX_THEME_VARIABLES)).not.toContain('--onyx-checkbox-indicator');
});
