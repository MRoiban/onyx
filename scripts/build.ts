// Builds the installable package: ESM per subpath, declarations, and a standalone stylesheet.
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dir, '..');
const dist = resolve(root, 'dist');
const pkg = await Bun.file(resolve(root, 'package.json')).json();

const entrypoints = Object.values(pkg.exports as Record<string, string | { import?: string }>)
  .map(target => (typeof target === 'string' ? undefined : target.import))
  .filter((target): target is string => !!target)
  .map(target => resolve(root, target.replace(/^\.\/dist\//, 'src/').replace(/\.js$/, '.ts')));

function run(command: string[]) {
  const result = Bun.spawnSync(command, { cwd: root, stdout: 'inherit', stderr: 'inherit' });
  if (result.exitCode !== 0) throw new Error(`${command.join(' ')} failed`);
}

await rm(dist, { recursive: true, force: true });

const js = await Bun.build({
  entrypoints,
  root: resolve(root, 'src'),
  outdir: dist,
  format: 'esm',
  target: 'browser',
  splitting: true,
  // Without this Bun emits react/jsx-dev-runtime, which production React apps don't serve.
  jsx: { development: false },
  packages: 'external',
  // Every component touches React state or effects; frameworks with server components need the marker.
  banner: '"use client";',
  naming: { entry: '[dir]/[name].js', chunk: 'chunks/[name]-[hash].js' },
});
if (!js.success) {
  for (const log of js.logs) console.error(log);
  throw new Error('JavaScript build failed');
}

for await (const path of new Bun.Glob('**/*.js').scan(dist)) {
  const text = await Bun.file(resolve(dist, path)).text();
  if (/jsx-dev-runtime|jsxDEV/.test(text)) throw new Error(`dist/${path} uses the development JSX runtime`);
}

run(['bunx', 'tsc', '-p', 'tsconfig.build.json']);

// NodeNext consumers require explicit extensions in declaration imports; bundler consumers accept them too.
for await (const path of new Bun.Glob('**/*.d.ts').scan(dist)) {
  const file = resolve(dist, path);
  const text = await Bun.file(file).text();
  const rewritten = text.replace(/((?:from|import)\s*\(?\s*['"])(\.{1,2}\/[^'"]+?)(['"])/g, (match, head, specifier, tail) => {
    if (/\.(?:js|json|css)$/.test(specifier)) return match;
    const base = resolve(file, '..', specifier);
    if (Bun.file(`${base}.d.ts`).size) return `${head}${specifier}.js${tail}`;
    if (Bun.file(`${base}/index.d.ts`).size) return `${head}${specifier}/index.js${tail}`;
    throw new Error(`Unresolved declaration import ${specifier} in ${path}`);
  });
  if (rewritten !== text) await Bun.write(file, rewritten);
}

// Inline the icon font so the stylesheet works without an asset pipeline.
const css = resolve(dist, 'styles.css');
run(['bunx', 'tailwindcss', '-c', 'tailwind.build.cjs', '-i', 'src/styles.css', '-o', css, '--minify']);
const font = Buffer.from(await Bun.file(resolve(root, 'node_modules/@vscode/codicons/dist/codicon.ttf')).arrayBuffer()).toString('base64');
const built = (await Bun.file(css).text()).replace(/url\([^)]*codicon\.ttf[^)]*\)/g, `url("data:font/ttf;base64,${font}")`);
if (built.includes('codicon.ttf')) throw new Error('Codicon font was not inlined');
await Bun.write(css, built);

console.log(`Built ${entrypoints.length} entrypoints and dist/styles.css`);
