import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { computeRegistry, IMPORT_RE, resolveRelative, packageName } from '../scripts/sync-registry';

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
    registryDependencies?: string[];
    files: Array<{ path: string }>;
  }>;
};

describe('onyx registry', () => {
  it('keeps package exports aligned with registry entries', () => {
    const exportedItems = Object.keys(packageJson.exports)
      .filter((entry) => !['.', './styles.css', './package.json', './registry.json', './tailwind.preset.cjs'].includes(entry))
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
      expect(Array.isArray(item.dependencies), `${item.name}:dependencies`).toBe(true);
      for (const dependency of item.dependencies ?? []) {
        expect(declaredDependencies.has(dependency), `${item.name}:${dependency}`).toBe(true);
      }
    }
  });

  it('derives dependency metadata from actual imports (run `bun run registry:sync`)', () => {
    expect(computeRegistry(registry as Parameters<typeof computeRegistry>[0])).toEqual(registry);
  });
  it('ships relative type imports and declares CSS and type-only package dependencies', () => {
    for (const name of ['progress', 'empty-state']) {
      expect(registry.items.find((item) => item.name === name)?.registryDependencies).toContain('badge');
    }
    expect(registry.items.find((item) => item.name === 'theme')?.dependencies).toContain('@vscode/codicons');
    const synthetic = computeRegistry({ items: [...registry.items, { name: 'types-fixture', files: [{ path: 'test/fix-b-imports.tsx', type: 'registry:ui' }, { path: 'test/fix-b-imports.css', type: 'registry:style' }] }] } as Parameters<typeof computeRegistry>[0]);
    const fixture = synthetic.items.at(-1)!;
    expect(fixture.dependencies).toContain('@floating-ui/react-dom');
    expect(fixture.dependencies).toContain('@vscode/codicons');
    expect(fixture.registryDependencies).toContain('badge');
  });

  it('has complete relative and package import closure including types and CSS layers', () => {
    const byName = new Map(registry.items.map((item) => [item.name, item]));
    for (const item of registry.items) {
      const files = new Set<string>();
      const dependencies = new Set(Object.keys(packageJson.peerDependencies ?? {}));
      const seen = new Set<string>();
      function include(name: string) {
        if (seen.has(name)) return;
        seen.add(name);
        const dependency = byName.get(name)!;
        expect(dependency, name).toBeDefined();
        dependency.files.forEach((file) => files.add(file.path));
        dependency.dependencies?.forEach((pkg) => dependencies.add(pkg));
        dependency.registryDependencies?.forEach(include);
      }
      include(item.name);
      for (const file of files) {
        const source = fs.readFileSync(path.join(onyxRoot, file), 'utf8');
        const imports = file.endsWith('.css') ? source.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g) : source.matchAll(IMPORT_RE);
        for (const match of imports) {
          const spec = file.endsWith('.css') ? match[1]! : match[2]!;
          if (spec.startsWith('.')) expect(files.has(resolveRelative(file, spec)), `${item.name}:${file}:${spec}`).toBe(true);
          else expect(dependencies.has(packageName(spec)), `${item.name}:${file}:${spec}`).toBe(true);
        }
      }
    }
  });

  it('provides a components entry for every registry item used by Bedrock barrels', () => {
    for (const item of registry.items) {
      expect(item.files.some((file) => new RegExp(`^src/components/${item.name}\\.tsx?$`).test(file.path)), item.name).toBe(true);
    }
  });


  it('ships only files under src/ (Bedrock sync rejects other paths)', () => {
    const outside = registry.items.flatMap((item) =>
      item.files.filter((file) => !file.path.startsWith('src/')).map((file) => `${item.name}:${file.path}`)
    );
    expect(outside).toEqual([]);
  });
});
