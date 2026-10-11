import { describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveChromium } from './browser';

const chromium = resolveChromium();
const browserDescribe = chromium ? describe : describe.skip;

browserDescribe('Fixed-height virtual list in an ancestor browser viewport', () => {
  it('preserves offset/scaled scroll, releases reveal anchors, and cleans observers and listeners', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-fixed-virtual-list-'));
    try {
      symlinkSync(join(process.cwd(), 'node_modules'), join(scratch, 'node_modules'));
      const source = `
        import * as React from ${JSON.stringify(join(process.cwd(), 'node_modules/react'))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom/client'))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom'))};
        import { useFixedVirtualList, findScrollableAncestor, getFixedVirtualListOffset, scrollFixedVirtualRowIntoView } from ${JSON.stringify(join(process.cwd(), 'src/components/fixed-virtual-list'))};
        const root = createRoot(document.getElementById('root'));
        const rows = Array.from({ length: 100 }, (_, index) => ({ id: 'row-' + index }));
        const listRef = React.createRef(), viewportRef = React.createRef();
        let latest, resizeDisconnected = 0, scrollAdds = 0, scrollRemoves = 0, windowAdds = 0, windowRemoves = 0;
        const NativeResize = window.ResizeObserver;
        window.ResizeObserver = class extends NativeResize { disconnect() { resizeDisconnected++; super.disconnect(); } };
        const originalAdd = EventTarget.prototype.addEventListener, originalRemove = EventTarget.prototype.removeEventListener;
        EventTarget.prototype.addEventListener = function(type, ...args) {
          if (this.id === 'viewport' && type === 'scroll') scrollAdds++;
          if (this === window && type === 'resize') windowAdds++;
          return originalAdd.call(this, type, ...args);
        };
        EventTarget.prototype.removeEventListener = function(type, ...args) {
          if (this.id === 'viewport' && type === 'scroll') scrollRemoves++;
          if (this === window && type === 'resize') windowRemoves++;
          return originalRemove.call(this, type, ...args);
        };
        const pause = () => new Promise(resolve => setTimeout(resolve, 30));
        function List({ rowHeight, anchor, data = rows, explicit = false }) {
          latest = useFixedVirtualList({ listRef, rows: data, getRowKey: row => row.id, rowHeight, anchor, overscan: 0,
            scrollElementRef: explicit ? viewportRef : undefined });
          return <div ref={listRef} id="list" style={{ paddingTop: latest.paddingTop, paddingBottom: latest.paddingBottom }}>
            {latest.rows.map(row => <div key={row.id} data-row={row.id} style={{ height: rowHeight }}>{row.id}</div>)}
          </div>;
        }
        function Fixture({ rowHeight = 20, anchor = null, list = true, data = rows, explicit = false }) {
          return <div ref={viewportRef} id="viewport" style={{ height: 100, overflowY: 'auto' }}>
            <header style={{ height: 30 }}>Header</header>
            {list && <div style={{ overflow: 'visible' }}><List rowHeight={rowHeight} anchor={anchor} data={data} explicit={explicit} /></div>}
          </div>;
        }
        const snapshot = () => ({ scrollTop: viewportRef.current.scrollTop, start: latest.startIndex, end: latest.endIndex,
          rows: latest.rows.map(row => row.id), paddingTop: latest.paddingTop, paddingBottom: latest.paddingBottom,
          offset: getFixedVirtualListOffset(listRef.current, viewportRef.current) });
        const scroll = top => flushSync(() => { viewportRef.current.scrollTop = top; viewportRef.current.dispatchEvent(new Event('scroll')); });
        (async () => {
          flushSync(() => root.render(<Fixture />)); await pause();
          const initial = snapshot();
          const ancestor = findScrollableAncestor(listRef.current).id;
          scroll(195); const offset = snapshot();
          flushSync(() => root.render(<Fixture rowHeight={40} />));
          const scaled = snapshot();
          const reveal = { id: 'reveal-1', rowKey: 'row-80', block: 'nearest' };
          flushSync(() => root.render(<Fixture rowHeight={40} anchor={reveal} />));
          const anchored = snapshot();
          scroll(80);
          const released = snapshot();
          flushSync(() => root.render(<Fixture rowHeight={40} anchor={reveal} />));
          const sameRequest = snapshot();
          flushSync(() => root.render(<Fixture rowHeight={40} anchor={{ ...reveal, id: 'reveal-2', block: 'center' }} />));
          const renewed = snapshot();
          // Anchors survive a missing row, then consume their request once that row arrives.
          const pending = { id: 'pending', rowKey: 'row-90', block: 'start' };
          flushSync(() => root.render(<Fixture rowHeight={40} anchor={pending} data={rows.slice(0, 10)} />));
          flushSync(() => root.render(<Fixture rowHeight={40} anchor={pending} />));
          const arrived = snapshot();
          scroll(0);
          const bounds = [];
          for (const [index, block] of [[5, 'start'], [5, 'end'], [0, 'start'], [99, 'end']]) {
            flushSync(() => { scrollFixedVirtualRowIntoView(listRef.current, viewportRef.current, index, block, 40);
              viewportRef.current.dispatchEvent(new Event('scroll')); });
            bounds.push(viewportRef.current.scrollTop);
          }
          flushSync(() => root.render(<Fixture rowHeight={40} list={false} />));
          const cleanup = { resizeDisconnected, scrollAdds, scrollRemoves, windowAdds, windowRemoves };
          // An explicit viewport uses the same offset geometry even when ancestor discovery is unavailable.
          flushSync(() => root.render(<Fixture explicit />)); await pause();
          scroll(195);
          const explicit = snapshot();
          document.getElementById('results').textContent = JSON.stringify({ initial, ancestor, offset, scaled, anchored, released, sameRequest, renewed, arrived, bounds, cleanup, explicit });
        })().catch(error => { document.getElementById('results').textContent = JSON.stringify({ error: String(error), stack: error.stack }); });
      `;
      const entry = join(scratch, 'entry.tsx');
      writeFileSync(entry, source);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: 'browser' });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, 'index.html'), '<!doctype html><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>');
      const proc = Bun.spawn([chromium!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=3000', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'pipe' });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results">([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      expect(output.ancestor).toBe('viewport');
      expect(output.initial).toMatchObject({ scrollTop: 0, start: 0, end: 5, offset: 30 });
      expect(output.offset).toMatchObject({ scrollTop: 195, start: 8, end: 13, offset: 30 });
      expect(output.scaled).toMatchObject({ scrollTop: 360, start: 8, end: 11, offset: 30 });
      expect(output.anchored).toMatchObject({ scrollTop: 3170, start: 78, end: 81, offset: 30 });
      expect(output.anchored.rows).toContain('row-80');
      expect(output.released).toMatchObject({ scrollTop: 80, start: 1, end: 4 });
      expect(output.sameRequest).toEqual(output.released);
      expect(output.renewed).toMatchObject({ scrollTop: 3200, start: 79, end: 82 });
      expect(output.arrived).toMatchObject({ scrollTop: 3630, start: 90, end: 93 });
      expect(output.bounds).toEqual([230, 170, 30, 3930]);
      expect(output.cleanup).toEqual({ resizeDisconnected: 1, scrollAdds: 1, scrollRemoves: 1, windowAdds: 1, windowRemoves: 1 });
      expect(output.explicit).toMatchObject({ scrollTop: 195, start: 8, end: 13, offset: 30 });
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
