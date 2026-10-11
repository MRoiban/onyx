/**
 * Derives each registry item's `dependencies`, `registryDependencies` and shared
 * lib files from the imports its source actually makes, so registry metadata
 * cannot drift from the code.
 *
 *   bun scripts/sync-registry.ts          rewrite registry.json
 *   bun scripts/sync-registry.ts --check  exit 1 when registry.json is stale
 */
import fs from 'node:fs';
import path from 'node:path';

type RegistryFile = { path: string; type: string };
type RegistryItem = {
  name: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
  [key: string]: unknown;
};
type Registry = { items: RegistryItem[]; [key: string]: unknown };

const root = path.resolve(import.meta.dir, '..');
const registryPath = path.join(root, 'registry.json');

/** Lib files copied into every item that imports them instead of being an item themselves. */
const INLINE_LIBS = new Set(['src/lib/cn.ts', 'src/lib/menu-styles.ts', 'src/lib/color.ts']);
const PEERS = new Set(['react', 'react-dom']);
export const IMPORT_RE =
  /^\s*(?:import|export)\s+(type\s+)?(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/gm;

function owner(file: string, itemNames: Set<string>, ownedFiles: Map<string, string>): string | null {
  if (INLINE_LIBS.has(file)) return null;
  const explicit = ownedFiles.get(file);
  if (explicit) return explicit;
  const component = /^src\/components\/([\w-]+)\.tsx?$/.exec(file)?.[1];
  if (component && itemNames.has(component)) return component;
  // Unregistered helpers (e.g. sidebar-environment.ts) ship with the item importing them.
  if (file.startsWith('src/components/') || file.startsWith('src/lib/')) return null;
  throw new Error(`No registry item owns ${file}`);
}

export function resolveRelative(fromFile: string, spec: string): string {
  const base = path.join(path.dirname(fromFile), spec);
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
    const full = path.join(root, candidate);
    if (fs.existsSync(full) && fs.statSync(full).isFile()) return candidate.split(path.sep).join('/');
  }
  throw new Error(`Cannot resolve ${spec} from ${fromFile}`);
}

export function packageName(spec: string): string {
  const parts = spec.split('/');
  return spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]!;
}

export function computeRegistry(registry: Registry): Registry {
  const itemNames = new Set(registry.items.map((item) => item.name));
  // Inline libs and component helpers are derived below, so drop previous copies first.
  const isDerived = (item: RegistryItem, file: RegistryFile) =>
    item.name !== 'hooks' &&
    (INLINE_LIBS.has(file.path) ||
      (file.type === 'registry:lib' && /^src\/(components|lib)\//.test(file.path)));
  const ownedFiles = new Map<string, string>();
  for (const item of registry.items) {
    for (const file of item.files) {
      if (!isDerived(item, file)) ownedFiles.set(file.path, item.name);
    }
  }

  const items = registry.items.map((item) => {
    const files = item.files.filter((file) => !isDerived(item, file));
    const deps = new Set<string>();
    const registryDeps = new Set<string>(item.name === 'theme' ? [] : ['theme']);
    const queue = files.map((file) => file.path).filter((file) => /\.(tsx?|css)$/.test(file));
    const seen = new Set(queue);

    while (queue.length) {
      const file = queue.shift()!;
      const source = fs.readFileSync(path.join(root, file), 'utf8');
      // Type-only references are required by consumers' TypeScript compiler too.
      const imports = file.endsWith('.css')
        ? source.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]/g)
        : source.matchAll(IMPORT_RE);
      for (const match of imports) {
        const spec = file.endsWith('.css') ? match[1]! : match[2]!;
        if (!spec.startsWith('.')) {
          const pkg = packageName(spec);
          if (!PEERS.has(pkg)) deps.add(pkg);
          continue;
        }
        const target = resolveRelative(file, spec);
        const targetOwner = owner(target, itemNames, ownedFiles);
        if (targetOwner === null) {
          if (!files.some((entry) => entry.path === target)) {
            files.push({ path: target, type: 'registry:lib' });
          }
          if (!seen.has(target)) {
            seen.add(target);
            queue.push(target);
          }
        } else if (targetOwner !== item.name) {
          registryDeps.add(targetOwner);
        }
      }
    }

    const next: RegistryItem = { ...item, files, dependencies: [...deps].sort() };
    if (registryDeps.size) next.registryDependencies = [...registryDeps].sort();
    else delete next.registryDependencies;
    return next;
  });

  return { ...registry, items };
}

if (import.meta.main) {
  const current = JSON.parse(fs.readFileSync(registryPath, 'utf8')) as Registry;
  const next = `${JSON.stringify(computeRegistry(current), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    if (next !== fs.readFileSync(registryPath, 'utf8')) {
      console.error('registry.json is stale; run `bun scripts/sync-registry.ts`.');
      process.exit(1);
    }
  } else {
    fs.writeFileSync(registryPath, next);
  }
}
