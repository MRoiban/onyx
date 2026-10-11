import { describe, expect, it } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveChromium } from './browser';

const chromium = resolveChromium();
const browserDescribe = chromium ? describe : describe.skip;

browserDescribe('OverlayScrollbar in a native browser viewport', () => {
  it('scrolls with keyboard and drag, observes replacement content, and cleans up on unmount', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-overlay-scrollbar-'));
    try {
      symlinkSync(join(process.cwd(), 'node_modules'), join(scratch, 'node_modules'));
      const source = `
        import * as React from ${JSON.stringify(join(process.cwd(), 'node_modules/react'))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom/client'))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom'))};
        import { OverlayScrollbar } from ${JSON.stringify(join(process.cwd(), 'src/components/overlay-scrollbar'))};
        const root = createRoot(document.getElementById('root'));
        const ref = React.createRef();
        const pause = () => new Promise(resolve => setTimeout(resolve, 30));
        const observerState = { resizeDisconnected: 0, mutationsDisconnected: 0 };
        const NativeResize = window.ResizeObserver, NativeMutation = window.MutationObserver;
        window.ResizeObserver = class extends NativeResize { disconnect() { observerState.resizeDisconnected++; super.disconnect(); } };
        window.MutationObserver = class extends NativeMutation { disconnect() { observerState.mutationsDisconnected++; super.disconnect(); } };
        function Fixture({ scrollbar = true, existingId = false }) {
          return <div className="region" style={{ position: 'relative', height: 100, width: 100, '--onyx-scale-ui': 1 }}>
            <div ref={ref} id={existingId ? 'owned-id' : undefined} style={{ height: 100, overflow: 'auto' }}><div style={{ height: 400 }}>Content</div></div>
            {scrollbar && <OverlayScrollbar scrollElementRef={ref} aria-label="Files scroll position" />}
          </div>;
        }
        (async () => {
          flushSync(() => root.render(<Fixture />));
          await pause();
          const viewport = ref.current;
          let thumb = document.querySelector('[role=scrollbar]');
          const initial = { height: thumb.style.height, controls: thumb.getAttribute('aria-controls'), id: viewport.id,
            label: thumb.getAttribute('aria-label'), max: thumb.getAttribute('aria-valuemax'), tabIndex: thumb.tabIndex };
          const keyboard = [];
          for (const key of ['ArrowDown', 'PageDown', 'End', 'ArrowUp', 'PageUp', 'Home']) {
            flushSync(() => thumb.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })));
            keyboard.push({ key, scrollTop: viewport.scrollTop, now: thumb.getAttribute('aria-valuenow') });
          }
          viewport.scrollTop = 90;
          flushSync(() => viewport.dispatchEvent(new Event('scroll')));
          const native = { now: thumb.getAttribute('aria-valuenow'), transform: thumb.style.transform };
          // Synthetic pointer events have no browser pointer IDs. Model capture explicitly, while exercising React's real DOM handlers.
          let captured = null, releases = 0;
          thumb.setPointerCapture = id => { captured = id; };
          thumb.hasPointerCapture = id => captured === id;
          thumb.releasePointerCapture = id => { if (captured === id) { captured = null; releases++; } };
          const pointer = (type, y, pointerId = 5) => flushSync(() => thumb.dispatchEvent(new PointerEvent(type, { pointerId, button: 0, clientY: y, bubbles: true, cancelable: true })));
          pointer('pointerdown', 30);
          pointer('pointermove', 60);
          const drag = { scrollTop: viewport.scrollTop, dragging: document.querySelector('[data-slot=overlay-scrollbar]').hasAttribute('data-dragging'), focused: document.activeElement === thumb };
          pointer('pointercancel', 60);
          pointer('pointermove', 80);
          const cancelled = { scrollTop: viewport.scrollTop, dragging: document.querySelector('[data-slot=overlay-scrollbar]').hasAttribute('data-dragging'), releases };
          pointer('pointerdown', 60);
          pointer('lostpointercapture', 60);
          const lostCapture = document.querySelector('[data-slot=overlay-scrollbar]').hasAttribute('data-dragging');
          const replacement = document.createElement('div'); replacement.style.height = '800px'; replacement.textContent = 'Replacement';
          viewport.replaceChildren(replacement);
          await pause();
          const replacementResult = { max: thumb.getAttribute('aria-valuemax'), height: thumb.style.height };
          replacement.style.height = '50px';
          await pause();
          const hidden = !document.querySelector('[role=scrollbar]');
          flushSync(() => root.render(<Fixture scrollbar={false} />));
          const cleaned = { id: viewport.id, ...observerState };
          flushSync(() => root.render(<Fixture scrollbar existingId />));
          await pause();
          flushSync(() => root.render(<Fixture scrollbar={false} existingId />));
          const preservedId = ref.current.id;
          document.getElementById('results').textContent = JSON.stringify({ initial, keyboard, native, drag, cancelled, lostCapture, replacementResult, hidden, cleaned, preservedId });
        })().catch(error => { document.getElementById('results').textContent = JSON.stringify({ error: String(error), stack: error.stack }); });
      `;
      const entry = join(scratch, 'entry.tsx');
      writeFileSync(entry, source);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: 'browser' });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, 'index.html'), `<!doctype html><style>:root { --onyx-scale-ui:1; --onyx-shell-scrollbar-thumb:#555; --onyx-shell-scrollbar-thumb-hover:#666; --onyx-shell-scrollbar-thumb-active:#777; --onyx-radius-full:999px; --onyx-duration-fast:100ms; --onyx-ease-standard:ease; --onyx-control-focus-ring:blue; --onyx-focus-ring-width:2px; }${readFileSync(join(process.cwd(), 'src/styles/overlay-scrollbar.css'), 'utf8')}</style><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>`);
      const proc = Bun.spawn([chromium!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=2500', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'pipe' });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results">([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      expect(output.initial).toMatchObject({ height: '25px', label: 'Files scroll position', max: '300', tabIndex: 0 });
      expect(output.initial.controls).toBe(output.initial.id);
      expect(output.initial.id.length).toBeGreaterThan(0);
      expect(output.keyboard.map((entry: { scrollTop: number; now: string }) => [entry.scrollTop, entry.now])).toEqual([[40, '40'], [140, '140'], [300, '300'], [260, '260'], [160, '160'], [0, '0']]);
      expect(output.native).toEqual({ now: '90', transform: 'translateY(22.5px)' });
      expect(output.drag).toEqual({ scrollTop: 210, dragging: true, focused: true });
      expect(output.cancelled).toEqual({ scrollTop: 210, dragging: false, releases: 1 });
      expect(output.lostCapture).toBe(false);
      expect(output.replacementResult).toEqual({ max: '700', height: '24px' });
      expect(output.hidden).toBe(true);
      expect(output.cleaned).toEqual({ id: '', resizeDisconnected: 1, mutationsDisconnected: 1 });
      expect(output.preservedId).toBe('owned-id');
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
