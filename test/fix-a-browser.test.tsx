import { describe, expect, it } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { renderToStaticMarkup } from 'react-dom/server';
import { OnyxThemeRoot } from '../src/components/theme';
import { resolveChromium } from './browser';
const require = createRequire(import.meta.url);
const postcss = require('postcss');
const baseConfig = require('../tailwind.config.cjs');
const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

async function probe(ownConfig = false, withoutRebinding = false) {
  const scratch = mkdtempSync(join(tmpdir(), 'onyx-fix-a-'));
  try {
    const config = { ...(ownConfig ? { theme: {} } : baseConfig), content: [...baseConfig.content, { raw: 'checked:bg-[var(--onyx-control-button-bg)] h-[var(--onyx-input-height,var(--onyx-control-height-md))]', extension: 'html' }] };
    const result = await postcss([require('postcss-import'), require('tailwindcss')(config)])
      .process(readFileSync('src/styles.css', 'utf8'), { from: join(process.cwd(), 'src/styles.css') });
    if (withoutRebinding) result.root.walkAtRules('scope', (rule: any) => rule.remove());
    writeFileSync(join(scratch, 'onyx.css'), withoutRebinding ? result.root.toString() : result.css);
    const roots = renderToStaticMarkup(<>
      <OnyxThemeRoot variables={{ buttonRadius: '17px', inputHeight: '43px' }}>
        <OnyxThemeRoot theme="light" density="comfortable"><OnyxThemeRoot>
          <button id="button" className="onyx-button">Button</button><input id="input" className="h-[var(--onyx-input-height,var(--onyx-control-height-md))]" />
        </OnyxThemeRoot></OnyxThemeRoot>
      </OnyxThemeRoot>
      <OnyxThemeRoot density="comfortable"><input id="density" className="h-[var(--onyx-input-height,var(--onyx-control-height-md))]" /></OnyxThemeRoot>
      <OnyxThemeRoot theme="light" id="fallback" variables={{ paletteBlue600: '#A02F6F', surfacePanel: '#112233' }} />
      <div data-theme="light"><OnyxThemeRoot id="aliases" variables={{ paletteBlue600: '#A02F6F', surfacePanel: '#112233' }} /></div>
      <div data-theme="dark" style={{ '--onyx-control-button-bg': 'orange', '--onyx-surface-sidebar': 'lime' } as any}>
        <OnyxThemeRoot id="preserve" variables={{ paletteBlue600: '#A02F6F', surfacePanel: '#112233' }} />
      </div>
      <div data-theme="light"><OnyxThemeRoot id="explicit" variables={{ paletteBlue600: '#A02F6F', controlButtonBg: 'purple' }} /></div>
    </>);
    writeFileSync(join(scratch, 'index.html'), `<!doctype html><link rel="stylesheet" href="onyx.css"><style>[data-slot="checkbox"]{background:red}</style>${roots}
      <input id="checkbox" type="checkbox" checked data-slot="checkbox" class="checked:bg-[var(--onyx-control-button-bg)]">
      <div id="shimmer" class="animate-onyx-shimmer"></div><div id="accordion" data-state="open" class="data-[state=open]:animate-accordion-open"></div>
      <div id="enter" data-state="open" class="data-[state=open]:animate-in data-[state=open]:fade-in-0"></div>
      <pre id="results"></pre><script>setTimeout(()=>{
        const s=id=>getComputedStyle(document.getElementById(id)); const unlayered=[],keyframes=[];
        function walk(rules,layer=false){for(const r of rules){const inside=layer||r.constructor.name==='CSSLayerBlockRule';if(r.type===1&&!inside)unlayered.push(r.selectorText);if(r.type===7)keyframes.push(r.name);if(r.cssRules)walk(r.cssRules,inside);}}
        walk(document.styleSheets[0].cssRules);
        document.getElementById('results').textContent=JSON.stringify({fallbackButton:s('fallback').getPropertyValue('--onyx-control-button-bg'),fallbackSidebar:s('fallback').getPropertyValue('--onyx-surface-sidebar'),radius:s('button').borderRadius,height:s('input').height,densityHeight:s('density').height,buttonBg:s('aliases').getPropertyValue('--onyx-control-button-bg'),sidebarBg:s('aliases').getPropertyValue('--onyx-surface-sidebar'),tabsBg:s('aliases').getPropertyValue('--onyx-shell-tabs-bg'),preserveButton:s('preserve').getPropertyValue('--onyx-control-button-bg'),preserveSidebar:s('preserve').getPropertyValue('--onyx-surface-sidebar'),explicitButton:s('explicit').getPropertyValue('--onyx-control-button-bg'),checkbox:s('checkbox').backgroundColor,shimmer:s('shimmer').animationName,accordion:s('accordion').animationName,enter:s('enter').animationName,unlayered,keyframes});
      },100);</script>`);
    const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=1000', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'ignore' });
    const dom = await new Response(proc.stdout).text();
    expect(await proc.exited).toBe(0);
    return JSON.parse(dom.match(/<pre id="results">([^<]+)<\/pre>/)![1]!);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}
browserDescribe('fix A real Chromium cascade', () => {
  it('preserves ancestor component overrides, live density, semantic rebindings and unlayered consumer priority', async () => {
    const result = await probe();
    expect(result).toMatchObject({ radius: '17px', height: '43px', densityHeight: '36px', buttonBg: '#A02F6F', sidebarBg: '#112233', tabsBg: '#112233', preserveButton: 'orange', preserveSidebar: 'lime', explicitButton: 'purple', checkbox: 'rgb(255, 0, 0)', unlayered: [] });
  });
  it('re-derives aliases with an explicit theme when semantic rebinding is unsupported', async () => {
    const result = await probe(true, true);
    expect(result.buttonBg).not.toBe('#A02F6F');
    expect(result.sidebarBg).not.toBe('#112233');
    expect(result.fallbackButton).toBe('#A02F6F');
    expect(result.fallbackSidebar).toBe('#112233');
  });
  it('ships every animation with an independent consumer Tailwind config', async () => {
    const result = await probe(true);
    expect(result).toMatchObject({ shimmer: 'onyx-shimmer', accordion: 'accordion-open', enter: 'enter', unlayered: [] });
    for (const name of ['onyx-spin', 'onyx-shimmer', 'onyx-pulse', 'onyx-indeterminate', 'onyx-toast-enter', 'onyx-toast-exit', 'toast-enter', 'toast-exit', 'accordion-open', 'accordion-close', 'collapsible-open', 'collapsible-close', 'enter', 'exit']) expect(result.keyframes).toContain(name);
  });
});
