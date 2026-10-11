import { describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveChromium } from './browser';

const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

browserDescribe('Final review native Checkbox reset', () => {
  it('keeps checked state, presentation, submission and callbacks synchronized across repeated native resets', async () => {
    const scratch = mkdtempSync(join(tmpdir(), 'onyx-fix3-reset-'));
    try {
      symlinkSync(join(process.cwd(), 'node_modules'), join(scratch, 'node_modules'));
      const source = `
        import * as React from ${JSON.stringify(join(process.cwd(), 'node_modules/react'))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom/client'))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), 'node_modules/react-dom'))};
        import { Checkbox } from ${JSON.stringify(join(process.cwd(), 'src/components/checkbox'))};
        import { ColorPicker } from ${JSON.stringify(join(process.cwd(), 'src/components/color-picker'))};
        import { isFocusableCandidate } from ${JSON.stringify(join(process.cwd(), 'src/lib/use-roving-focus'))};
        import { useRemovalFocus } from ${JSON.stringify(join(process.cwd(), 'src/lib/use-removal-focus'))};
        const root = createRoot(document.getElementById('root'));
        const pause = () => new Promise(resolve => setTimeout(resolve, 20));
        const results = [];
        async function probe(defaultChecked, external) {
          const changes = [];
          const control = <Checkbox id="check" name="check" defaultChecked={defaultChecked}
            form={external ? 'form' : undefined} onChange={e => changes.push(e.target.checked)} />;
          flushSync(() => root.render(external ? <><form id="form" />{control}</> : <form id="form">{control}</form>));
          const input = document.getElementById('check'), form = document.getElementById('form');
          const steps = [];
          const record = () => steps.push({ checked: input.checked, state: input.dataset.state,
            submitted: new FormData(form).has('check'), calls: changes.length });
          for (let i = 0; i < 3; i++) {
            flushSync(() => input.click()); record();
            form.reset(); await pause(); record();
          }
          results.push({ defaultChecked, external, changes, steps });
          flushSync(() => root.render(null));
        }
        (async () => {
          for (const defaultChecked of [true, false]) for (const external of [false, true]) await probe(defaultChecked, external);
          const changes = [];
          flushSync(() => root.render(<form onReset={e => e.preventDefault()}><Checkbox id="cancel" defaultChecked onChange={e => changes.push(e.target.checked)} /></form>));
          const cancel = document.getElementById('cancel');
          flushSync(() => cancel.click()); cancel.form.reset(); await pause();
          const cancelled = { checked: cancel.checked, state: cancel.dataset.state, changes };
          flushSync(() => root.render(null));
          const controlledResults = [];
          for (const checked of [false, true]) {
            const changes = [];
            flushSync(() => root.render(<form><Checkbox id="controlled" checked={checked} onChange={e => changes.push(e.target.checked)} /></form>));
            const controlled = document.getElementById('controlled');
            for (let i = 0; i < 3; i++) {
              flushSync(() => controlled.click());
              controlled.defaultChecked = !checked;
              controlled.form.reset(); await pause();
            }
            controlledResults.push({ checked: controlled.checked, state: controlled.dataset.state, changes });
            flushSync(() => root.render(null));
          }
          flushSync(() => root.render(<form><Checkbox id="mixed" aria-checked="mixed" defaultChecked /></form>));
          const mixed = document.getElementById('mixed');
          flushSync(() => mixed.click()); mixed.form.reset(); await pause();
          const mixedResult = { checked: mixed.checked, indeterminate: mixed.indeterminate, state: mixed.dataset.state };
          flushSync(() => root.render(null));
          const colors = [];
          for (const external of [false, true]) {
            const changes = [];
            const picker = <ColorPicker defaultValue="#ff0000" name="color" form={external ? 'color-form' : undefined} onValueChange={v => changes.push(v)} />;
            flushSync(() => root.render(external ? <><form id="color-form" />{picker}</> : <form id="color-form">{picker}</form>));
            await pause();
            changes.length = 0;
            const text = document.querySelector('[data-slot="color-picker"] input[type="text"]');
            flushSync(() => {
              Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(text, '#zz');
              text.dispatchEvent(new Event('input', { bubbles: true }));
            });
            const invalidDraft = text.value;
            const form = document.getElementById('color-form');
            form.reset(); await pause();
            colors.push({ external, invalidDraft, draft: text.value, invalid: text.getAttribute('aria-invalid'), value: new FormData(form).get('color'), changes });
            flushSync(() => root.render(null));
          }
          function FocusProbe() {
            const [removed, setRemoved] = React.useState(false);
            const ref = React.useRef(null), fallbackRef = React.useRef(null);
            const { captureFocus } = useRemovalFocus(ref, '[data-item]', { fallbackRef });
            return <><button id="fallback" ref={fallbackRef}>Fallback</button><div ref={ref} onFocusCapture={captureFocus}>
              {!removed && <div data-item><button id="remove" onClick={() => setRemoved(true)}>Remove</button></div>}
              <div data-item style={{ visibility: 'hidden' }}><button id="hidden">Hidden</button><button id="visible" style={{ visibility: 'visible' }}>Visible</button></div>
              <div data-item style={{ display: 'none' }}><button id="display" style={{ visibility: 'visible' }}>Display</button></div>
            </div></>;
          }
          flushSync(() => root.render(<FocusProbe />));
          const focus = { visible: isFocusableCandidate(document.getElementById('visible')), hidden: isFocusableCandidate(document.getElementById('hidden')), display: isFocusableCandidate(document.getElementById('display')) };
          document.getElementById('remove').focus();
          flushSync(() => document.getElementById('remove').click());
          focus.active = document.activeElement.id;
          document.getElementById('results').textContent = JSON.stringify({ results, cancelled,
            controlled: controlledResults, mixed: mixedResult, colors, focus });
        })().catch(error => { document.getElementById('results').textContent = JSON.stringify({ error: String(error) }); });
      `;
      const entry = join(scratch, 'entry.tsx');
      writeFileSync(entry, source);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: 'browser' });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, 'index.html'), '<!doctype html><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>');
      const proc = Bun.spawn([shell!, '--no-sandbox', '--allow-file-access-from-files', '--virtual-time-budget=2000', '--dump-dom', `file://${join(scratch, 'index.html')}`], { stdout: 'pipe', stderr: 'pipe' });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results">([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      for (const result of output.results) {
        expect(result.changes).toEqual(Array(3).fill(!result.defaultChecked));
        result.steps.forEach((step: { checked: boolean; state: string; submitted: boolean; calls: number }, index: number) => {
          const checked = index % 2 ? result.defaultChecked : !result.defaultChecked;
          expect(step).toEqual({ checked, state: checked ? 'checked' : 'unchecked', submitted: checked, calls: Math.floor(index / 2) + 1 });
        });
      }
      expect(output.cancelled).toEqual({ checked: false, state: 'unchecked', changes: [false] });
      expect(output.controlled).toEqual([
        { checked: false, state: 'unchecked', changes: [true, true, true] },
        { checked: true, state: 'checked', changes: [false, false, false] },
      ]);
      expect(output.mixed).toEqual({ checked: true, indeterminate: true, state: 'indeterminate' });
      for (const color of output.colors) {
        expect(color).toEqual({ external: color.external, invalidDraft: '#zz', draft: '#ff0000', invalid: null, value: '#ff0000', changes: [] });
      }
      expect(output.focus).toEqual({ visible: true, hidden: false, display: false, active: 'visible' });
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
