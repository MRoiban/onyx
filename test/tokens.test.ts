import { describe, it, expect } from 'bun:test';
import { readdirSync, readFileSync } from 'node:fs';
import {
  ONYX_SEMANTIC_DARK,
  ONYX_SEMANTIC_LIGHT,
  ONYX_PALETTE,
  ONYX_COMPONENT_TOKENS,
  ONYX_THEME_VARIABLES,
} from '../src/theme/tokens';
describe('token contract', () => {
  it('defines every semantic variable in both themes', () => {
    expect(Object.keys(ONYX_SEMANTIC_LIGHT).sort()).toEqual(
      Object.keys(ONYX_SEMANTIC_DARK).sort(),
    );
    for (const value of Object.values(ONYX_SEMANTIC_LIGHT))
      expect(value.length).toBeGreaterThan(0);
  });
  it('publishes all three tiers', () => {
    const names = new Set(Object.values(ONYX_THEME_VARIABLES));
    for (const map of [ONYX_PALETTE, ONYX_SEMANTIC_DARK, ONYX_COMPONENT_TOKENS])
      for (const key of Object.keys(map))
        expect(names.has(key as any)).toBe(true);
  });
  it('forbids raw hex and generic shell tab borders', () => {
    for (const file of readdirSync('src/components').filter((x) =>
      x.endsWith('.tsx'),
    )) {
      const source = readFileSync('src/components/' + file, 'utf8');
      expect(source, file).not.toMatch(/#[\da-fA-F]{3,8}\b/);
      if (file !== 'tabs.tsx')
        expect(source, file).not.toContain('--onyx-shell-tabs-border');
    }
  });
});

describe('expanded public token contract', () => {
  it('registers every primitive CSS/TSX token read except documented private geometry', async () => {
    const { ONYX_PRIVATE_VARIABLES } = await import('../src/theme/tokens');
    const registered = new Set<string>(Object.values(ONYX_THEME_VARIABLES));
    const privateNames = new Set<string>(ONYX_PRIVATE_VARIABLES);
    for (const folder of ['src/styles', 'src/components']) {
      for (const file of readdirSync(folder).filter(file => /\.(css|tsx)$/.test(file))) {
        const source = readFileSync(`${folder}/${file}`, 'utf8');
        for (const match of source.matchAll(/--onyx-[a-z0-9-]+/g)) {
          const name = match[0];
          // Template prefix in layout's spaceKey(), rather than a variable name.
          if (name.endsWith('-')) continue;
          expect(registered.has(name) || privateNames.has(name), `${file}: ${name}`).toBe(true);
        }
      }
    }
  });
  it('assigned typography and geometry use theme tokens instead of Tailwind defaults or pixel calculations', () => {
    for (const file of ['text', 'table', 'dialog', 'prompt']) {
      const source = readFileSync(`src/components/${file}.tsx`, 'utf8');
      expect(source, file).not.toMatch(/[\s\x27\x22]text-(?:xs|sm|base|lg|xl)(?=[\s\x27\x22])/);
      expect(source, file).not.toMatch(/calc\(\d+px/);
      expect(source, file).not.toMatch(/\b(?:px|py|gap|space-y)-\d+/);
    }
  });
});

describe('component token fallbacks', () => {
  it('every component-token read in source carries its default, so no build step is needed', async () => {
    const { ONYX_COMPONENT_TOKENS } = await import('../src/theme/tokens');
    const { readdirSync, readFileSync } = await import('node:fs');
    const files = [
      ...readdirSync('src/components').filter((f) => f.endsWith('.tsx')).map((f) => `src/components/${f}`),
      ...readdirSync('src/styles').filter((f) => f.endsWith('.css')).map((f) => `src/styles/${f}`)
    ];
    const missing: string[] = [];
    for (const file of files) {
      for (const match of readFileSync(file, 'utf8').matchAll(/var\((--onyx-[a-z0-9-]+)\)/g)) {
        if (match[1]! in ONYX_COMPONENT_TOKENS) missing.push(`${file}: ${match[0]}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
