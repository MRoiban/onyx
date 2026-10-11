import * as React from 'react';
import { describe, it, expect } from 'bun:test';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import { OnyxThemeRoot } from '../src/components/theme';
import { Checkbox } from '../src/components/checkbox';
import { Switch } from '../src/components/switch';
import { NumberField } from '../src/components/number-field';
import { resolveChromium } from './browser';
const require = createRequire(import.meta.url);
const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;
async function probe(forced = false) {
  const scratch = mkdtempSync(join(tmpdir(), 'onyx-fix2-d-'));
  try {
    const css = await require('postcss')([require('postcss-import'), require('tailwindcss')(require('../tailwind.config.cjs'))]).process(readFileSync('src/styles.css', 'utf8'), { from: join(process.cwd(), 'src/styles.css') });
    writeFileSync(join(scratch, 'onyx.css'), css.css);
    const markup = renderToStaticMarkup(<>{(['compact', 'comfortable'] as const).map(density => <OnyxThemeRoot key={density} density={density} theme="light" style={{ padding: 'var(--onyx-space-8)' }}><h2>{density}</h2><div><label><Checkbox defaultChecked /> Checked</label> <label><Checkbox aria-checked="mixed" className="mixed" /> Indeterminate</label> <label><Checkbox /> Unchecked</label></div><Switch defaultChecked style={{ transition: 'none' }} /><NumberField defaultValue={2} /></OnyxThemeRoot>)}</>);
    writeFileSync(join(scratch, 'index.html'), `<!doctype html><link rel="stylesheet" href="onyx.css">${markup}<pre id="results" hidden></pre><script>
      document.querySelectorAll('.mixed').forEach(e=>e.indeterminate=true);
      setTimeout(()=>{
        const result=[...document.querySelectorAll('[data-onyx-theme-root]')].map(root=>{
          const track=root.querySelector('[role=switch]'), thumb=track.querySelector('span');
          thumb.style.transition='none'; const t=track.getBoundingClientRect(), h=thumb.getBoundingClientRect();
          const buttons=[...root.querySelectorAll('[data-slot=number-field-steppers] button')];
          const hits=buttons.map((button,i)=>{
            const r=button.getBoundingClientRect(), p=getComputedStyle(button,'::after'), w=parseFloat(p.width), height=parseFloat(p.height), x=r.left+(r.width-w)/2, y=i?r.top+button.clientTop:r.bottom-height-parseFloat(p.bottom);
            let correct=0; for(let dx=.5;dx<w;dx++)for(let dy=.5;dy<height;dy++)if(document.elementFromPoint(x+dx,y+dy)?.closest('button')===button)correct++;
            return {correct,total:w*height,iconPointer:getComputedStyle(button.firstElementChild).pointerEvents};
          });
          return {density:root.dataset.density,rightGap:t.right-h.right,padding:parseFloat(getComputedStyle(track).paddingRight),travel:new DOMMatrix(getComputedStyle(thumb).transform).m41,hits};
        });
        document.getElementById('results').textContent=JSON.stringify({forced:matchMedia('(forced-colors: active)').matches,appearance:getComputedStyle(document.querySelector('.onyx-checkbox')).appearance,indicator:getComputedStyle(document.querySelector('.onyx-checkbox'),'::after').display,result});
      },100);
    </script>`);
    // The screenshot directory is gitignored, so fresh checkouts lack it.
    if (forced) mkdirSync(join(process.cwd(), 'gallery/screenshots'), { recursive: true });
    const flags = forced ? ['--force-high-contrast', `--screenshot=${join(process.cwd(), 'gallery/screenshots/fix2-d-checkbox-forced.png')}`] : [];
    const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--window-size=1000,800', '--virtual-time-budget=1000', '--dump-dom', ...flags, `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'ignore' });
    const dom = await new Response(proc.stdout).text();
    expect(await proc.exited).toBe(0);
    return JSON.parse(dom.match(/<pre id="results"[^>]*>([^<^<]+)<\/pre>/)![1]);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}
browserDescribe('Forms round 2 Chromium', () => {
  it('R2 forced colors use native distinct checked, mixed and unchecked indicators', async () => {
    const result = await probe(true);
    expect(result.forced).toBe(true);
    expect(result.appearance).toBe('auto');
    expect(result.indicator).toBe('none');
  });
  it('R3 Switch aligns checked thumbs and R6 steppers retain all 24 by 24 hit pixels', async () => {
    const result = await probe();
    expect(result.result.length).toBe(2);
    for (const [i, row] of result.result.entries()) {
      expect(row.travel).toBe(i ? 18 : 14);
      expect(row.rightGap).toBeCloseTo(row.padding, 2);
      for (const hit of row.hits) {
        expect(hit.total).toBe(576);
        expect(hit.correct).toBe(576);
        expect(hit.iconPointer).toBe('none');
      }
    }
  });
});
