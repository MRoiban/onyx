import { describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveChromium } from './browser';

const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

browserDescribe('AnchoredPopover native geometry and focus', () => {
  it('tracks an external scroller, flips/shifts on viewport collisions and preserves nonmodal focus destinations', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-anchored-popover-'));
    try {
      symlinkSync(join(process.cwd(), 'node_modules'), join(scratch, 'node_modules'));
      const entry = join(scratch, 'entry.tsx');
      writeFileSync(entry, `
        import * as React from ${JSON.stringify(join(process.cwd(), 'node_modules/react'))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom/client'))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom'))};
        import { AnchoredPopover } from ${JSON.stringify(join(process.cwd(), 'src/components/anchored-popover'))};
        const root = createRoot(document.getElementById('root'));
        const pause = () => new Promise(resolve => setTimeout(resolve, 80));
        const result = {}, requests = [];
        let show;
        function Fixture() {
          const [anchor, setAnchor] = React.useState(null), [open, setOpen] = React.useState(true);
          show = setOpen;
          return <>
            <button id="before">Before</button>
            <div id="viewport" style={{ position: 'fixed', left: 40, top: 100, width: 320, height: 260, overflow: 'auto' }}>
              <div style={{ height: 700, paddingTop: 90 }}><button id="anchor" ref={setAnchor}>External anchor</button></div>
            </div>
            <button id="after">After</button>
            <AnchoredPopover anchor={anchor} open={open} onOpenChange={value => { requests.push(value); setOpen(value); }}
              aria-label="Connection" align="start" side="bottom" sideOffset={8}
              style={{ width: 180, height: 90, padding: 0, border: 0, margin: 0 }}>
              <button disabled>Disabled</button><button id="first">First</button><button id="last">Last</button>
            </AnchoredPopover>
          </>;
        }
        const surface = () => document.querySelector('[data-slot="anchored-popover"]');
        const rect = () => { const { left, top, right, bottom } = surface().getBoundingClientRect(); return { left, top, right, bottom }; };
        const key = (node, key, shiftKey = false) => node.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true }));
        const open = async () => { flushSync(() => show(true)); await pause(); };
        (async () => {
          flushSync(() => root.render(<Fixture />)); await pause();
          const anchor = document.getElementById('anchor'), viewport = document.getElementById('viewport');
          result.initialFocus = document.activeElement.id;
          result.insertedAnchor = !!document.querySelector('[data-slot="popover-anchor"]');
          result.initial = rect();
          viewport.scrollTop = 40; viewport.dispatchEvent(new Event('scroll')); await pause();
          result.scrolled = rect();
          Object.assign(anchor.style, { position: 'fixed', top: (innerHeight - 25) + 'px', left: (innerWidth - 30) + 'px', width: '25px', height: '20px' });
          window.dispatchEvent(new Event('resize')); await pause();
          result.collided = { ...rect(), side: surface().dataset.side, width: innerWidth, height: innerHeight };
          key(document.getElementById('first'), 'Escape'); await pause();
          result.escape = { closed: !surface(), focus: document.activeElement.id };
          await open();
          anchor.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
          anchor.focus(); anchor.dispatchEvent(new MouseEvent('click', { bubbles: true })); await pause();
          result.anchorInteractionKeepsOpen = !!surface();
          document.getElementById('first').focus();
          const after = document.getElementById('after');
          after.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }));
          after.focus(); after.dispatchEvent(new MouseEvent('click', { bubbles: true })); await pause();
          result.outside = { closed: !surface(), focus: document.activeElement.id };
          await open();
          key(document.getElementById('first'), 'Tab');
          result.interiorTabKeepsOpen = !!surface();
          document.getElementById('last').focus();
          const priorRequests = requests.length;
          key(document.getElementById('last'), 'Tab'); await pause();
          result.forwardTab = { closed: !surface(), focus: document.activeElement.id, requests: requests.length - priorRequests };
          await open();
          key(document.getElementById('first'), 'Tab', true); await pause();
          result.backwardTab = { closed: !surface(), focus: document.activeElement.id };
          document.getElementById('results').textContent = JSON.stringify(result);
        })().catch(error => document.getElementById('results').textContent = JSON.stringify({ error: String(error), stack: error.stack }));
      `);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: 'browser' });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, 'index.html'), '<!doctype html><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>');
      const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=3000', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'pipe' });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results">([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      expect(output.initialFocus).toBe('first');
      expect(output.insertedAnchor).toBe(false);
      expect(output.initial.top - output.scrolled.top).toBeCloseTo(40, 0);
      expect(output.collided.side).toBe('top');
      expect(output.collided.left).toBeGreaterThanOrEqual(8);
      expect(output.collided.right).toBeLessThanOrEqual(output.collided.width - 8);
      expect(output.collided.bottom).toBeLessThanOrEqual(output.collided.height - 8);
      expect(output.escape).toEqual({ closed: true, focus: 'anchor' });
      expect(output.anchorInteractionKeepsOpen).toBe(true);
      expect(output.outside).toEqual({ closed: true, focus: 'after' });
      expect(output.interiorTabKeepsOpen).toBe(true);
      expect(output.forwardTab).toEqual({ closed: true, focus: 'after', requests: 1 });
      expect(output.backwardTab).toEqual({ closed: true, focus: 'anchor' });
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
