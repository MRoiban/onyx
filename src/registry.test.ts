import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const currentDir = fileURLToPath(new URL('.', import.meta.url));
const onyxRoot = path.resolve(currentDir, '..');
const packageJson = JSON.parse(
  fs.readFileSync(path.join(onyxRoot, 'package.json'), 'utf8')
) as {
  exports: Record<string, string>;
  dependencies: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const registry = JSON.parse(
  fs.readFileSync(path.join(onyxRoot, 'registry.json'), 'utf8')
) as {
  items: Array<{
    name: string;
    dependencies?: string[];
    files: Array<{ path: string }>;
  }>;
};

describe('onyx registry', () => {
  it('keeps package exports aligned with registry entries', () => {
    const exportedItems = Object.keys(packageJson.exports)
      .filter((entry) => !['.', './styles.css', './package.json', './registry.json'].includes(entry))
      .map((entry) => entry.replace('./', ''))
      .sort();
    const registryItems = registry.items.map((item) => item.name).sort();

    expect(registryItems).toEqual(exportedItems);
  });

  it('references existing source files for every registry item', () => {
    for (const item of registry.items) {
      for (const file of item.files) {
        expect(fs.existsSync(path.join(onyxRoot, file.path)), `${item.name}:${file.path}`).toBe(
          true
        );
      }
    }
  });

  it('keeps dependency metadata resolvable from the package manifest', () => {
    const declaredDependencies = new Set([
      ...Object.keys(packageJson.dependencies),
      ...Object.keys(packageJson.peerDependencies ?? {})
    ]);

    for (const item of registry.items) {
      expect(item.dependencies?.length, `${item.name}:dependencies`).toBeGreaterThan(0);
      for (const dependency of item.dependencies ?? []) {
        expect(declaredDependencies.has(dependency), `${item.name}:${dependency}`).toBe(true);
      }
    }
  });
});
