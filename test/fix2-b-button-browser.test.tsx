import { describe, expect, it } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '../src/components/button';
import { Toolbar, ToolbarGroup } from '../src/components/toolbar';
import { InputGroup, InputGroupInput } from '../src/components/input-group';
import { resolveChromium } from './browser';
const require = createRequire(import.meta.url);
const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

browserDescribe('fix2 B real Chromium compact targets', () => {
  it('reserves 24px hit targets without covering zero-gap neighbour boxes in rows, columns, Toolbar and InputGroup', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-fix2-b-'));
    try {
      const pair = (prefix: string, size: 'xs' | 'icon-xs' = 'icon-xs') => <><Button id={`${prefix}-a`} size={size}>A</Button><Button id={`${prefix}-b`} size={size}>B</Button></>;
      let markup = renderToStaticMarkup(<div data-theme="light" data-density="compact">
        <div className="probe" style={{ display: 'flex', gap: 0 }}>{pair('row')}</div>
        <div className="probe" style={{ display: 'flex', gap: 0 }}>{pair('xs', 'xs')}</div>
        <div className="probe" style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: 0 }}>{pair('column')}</div>
        <Toolbar><ToolbarGroup className="probe" style={{ gap: 0 }}>{pair('toolbar')}</ToolbarGroup></Toolbar>
        <InputGroup className="probe" style={{ width: '300px' }} trailing={<div style={{ display: 'flex', gap: 0 }}>{pair('input')}</div>}><InputGroupInput id="input-control" /></InputGroup>
      </div>);
      // Optional pre-fix repro removes only the new spacing reservation.
      if (process.env.ONYX_BUTTON_BASELINE) markup = markup.replace(/ m-\[max\([^\]]+\)\]/g, '');
      const config = { ...require('../tailwind.config.cjs'), content: [{ raw: markup, extension: 'html' }] };
      const css = await require('postcss')([require('postcss-import'), require('tailwindcss')(config)]).process(readFileSync('src/styles.css', 'utf8'), { from: join(process.cwd(), 'src/styles.css') });
      writeFileSync(join(scratch, 'onyx.css'), css.css);
      writeFileSync(join(scratch, 'index.html'), `<!doctype html><link rel="stylesheet" href="onyx.css"><style>.probe{margin:32px}</style>${markup}<pre id="results"></pre><script>
        const results=[];
        for(const button of document.querySelectorAll('button')) {
          const r=button.getBoundingClientRect(), pseudo=getComputedStyle(button,'::after');
          let stolen=0, missed=0;
          for(let y=Math.ceil(r.top);y<r.bottom;y++) for(let x=Math.ceil(r.left);x<r.right;x++) if(document.elementFromPoint(x,y)?.closest('button')!==button) stolen++;
          const w=Math.max(r.width,24),h=Math.max(r.height,24),left=r.left+(r.width-w)/2,top=r.top+(r.height-h)/2;
          for(let y=Math.ceil(top);y<top+h;y++) for(let x=Math.ceil(left);x<left+w;x++) if(document.elementFromPoint(x,y)?.closest('button')!==button) missed++;
          results.push({id:button.id,width:r.width,height:r.height,pseudoWidth:parseFloat(pseudo.width),pseudoHeight:parseFloat(pseudo.height),stolen,missed});
        }
        const input=document.getElementById('input-control'),r=input.getBoundingClientRect();let inputStolen=0;
        for(let y=Math.ceil(r.top);y<r.bottom;y++)for(let x=Math.ceil(r.left);x<r.right;x++)if(document.elementFromPoint(x,y)!==input)inputStolen++;
        document.getElementById('results').textContent=JSON.stringify({buttons:results,inputStolen});
      </script>`);
      const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'ignore' });
      const dom = await new Response(proc.stdout).text();
      expect(await proc.exited).toBe(0);
      const result = JSON.parse(dom.match(/<pre id="results">([^<]+)<\/pre>/)![1]!);
      console.log('R14 Chromium pixel sampling:', JSON.stringify(result));
      expect(result.buttons).toHaveLength(10);
      for (const button of result.buttons) {
        expect(button.height).toBe(20);
        if (!button.id.startsWith('xs')) expect(button.width).toBe(20);
        expect(button.pseudoWidth).toBeGreaterThanOrEqual(24);
        expect(button.pseudoHeight).toBeGreaterThanOrEqual(24);
        expect(button.stolen).toBe(0);
        expect(button.missed).toBe(0);
      }
      expect(result.inputStolen).toBe(0);
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
