import { describe, expect, it } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { resolveChromium } from './browser';

const require = createRequire(import.meta.url);
const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

browserDescribe('Select portal typography', () => {
  it('matches the chosen value for default, scoped and inline fonts, and refreshes on reopening', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-select-font-'));
    try {
      symlinkSync(join(process.cwd(), 'node_modules'), join(scratch, 'node_modules'));
      const css = await require('postcss')([require('postcss-import'), require('tailwindcss')(require('../tailwind.config.cjs'))])
        .process(readFileSync('src/styles.css', 'utf8'), { from: join(process.cwd(), 'src/styles.css') });
      writeFileSync(join(scratch, 'onyx.css'), css.css);
      const entry = join(scratch, 'entry.tsx');
      writeFileSync(entry, `
        import * as React from ${JSON.stringify(join(process.cwd(), 'node_modules/react'))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom/client'))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom'))};
        import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from ${JSON.stringify(join(process.cwd(), 'src/components/select'))};
        const root = createRoot(document.getElementById('root'));
        const pause = () => new Promise(resolve => setTimeout(resolve, 30));
        const results = [];
        const typography = node => {
          const css = getComputedStyle(node);
          return Object.fromEntries(['fontSize', 'fontFamily', 'fontWeight', 'lineHeight', 'letterSpacing'].map(key => [key, css[key]]));
        };
        function Fixture({ scoped, triggerStyle, open, contentStyle }) {
          return <div className={scoped ? 'setting-control' : undefined}>
            <Select open={open} defaultValue="on">
              <SelectTrigger id="trigger" style={triggerStyle}><SelectValue /></SelectTrigger>
              <SelectContent style={contentStyle}>
                <SelectItem value="on">on</SelectItem><SelectItem value="off">off</SelectItem>
              </SelectContent>
            </Select>
          </div>;
        }
        async function probe(name, props) {
          flushSync(() => root.render(<Fixture {...props} open={false} />));
          await pause();
          flushSync(() => root.render(<Fixture {...props} open />));
          await pause();
          const trigger = document.getElementById('trigger');
          const content = document.querySelector('[data-slot="select-content"]');
          const items = [...document.querySelectorAll('[data-slot="select-item"]')];
          results.push({ name, trigger: typography(trigger), items: items.map(typography), portaled: !trigger.parentElement.contains(content) });
        }
        (async () => {
          await probe('default', {});
          await probe('scoped', { scoped: true });
          await probe('inline', { triggerStyle: { fontSize: '20px', fontFamily: 'monospace', fontWeight: 600, lineHeight: '27px', letterSpacing: '1px' } });
          await probe('reopened', { triggerStyle: { fontSize: '18px', fontFamily: 'serif', fontWeight: 400, lineHeight: '24px', letterSpacing: '0.5px' } });
          await probe('contentOverride', { triggerStyle: { fontSize: '16px' }, contentStyle: { fontSize: '22px' } });
          document.getElementById('results').textContent = JSON.stringify({ results });
        })().catch(error => document.getElementById('results').textContent = JSON.stringify({ error: String(error) }));
      `);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: 'browser' });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, 'index.html'), `<!doctype html><link rel="stylesheet" href="onyx.css"><style>.setting-control{font-family:serif}.setting-control button{font-size:16px;line-height:24px;font-weight:500;letter-spacing:0.2px}</style><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>`);
      const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=3000', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'pipe' });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results"[^>]*>([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      expect(output.results.map((result: any) => result.trigger.fontSize)).toEqual(['13px', '16px', '20px', '18px', '16px']);
      for (const result of output.results) {
        expect(result.portaled).toBe(true);
        expect(result.items).toHaveLength(2);
        for (const item of result.items) expect(item).toEqual({ ...result.trigger, ...(result.name === 'contentOverride' ? { fontSize: '22px' } : {}) });
      }
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
