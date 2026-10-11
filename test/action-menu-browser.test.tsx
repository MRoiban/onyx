import { describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
import { resolveChromium } from "./browser";

const require = createRequire(import.meta.url);
const shell = resolveChromium();
const browserDescribe = shell ? describe : describe.skip;

browserDescribe("ActionMenu browser interaction", () => {
  it("places point menus, skips disabled commands, navigates flyouts and restores focus on dismissal", async () => {
    const scratch = mkdtempSync(join(tmpdir(), "onyx-action-menu-"));
    try {
      symlinkSync(join(process.cwd(), "node_modules"), join(scratch, "node_modules"));
      const css = await require("postcss")([require("postcss-import"), require("tailwindcss")(require("../tailwind.config.cjs"))])
        .process(readFileSync("src/styles.css", "utf8"), { from: join(process.cwd(), "src/styles.css") });
      writeFileSync(join(scratch, "onyx.css"), css.css);
      const entry = join(scratch, "entry.tsx");
      writeFileSync(entry, `
        import * as React from ${JSON.stringify(join(process.cwd(), "node_modules/react"))};
        import { createRoot } from ${JSON.stringify(join(process.cwd(), "node_modules/react-dom/client"))};
        import { flushSync } from ${JSON.stringify(join(process.cwd(), "node_modules/react-dom"))};
        import { ActionMenu } from ${JSON.stringify(join(process.cwd(), "src/components/action-menu"))};
        const root = createRoot(document.getElementById('root'));
        const pause = () => new Promise(resolve => setTimeout(resolve, 240));
        const selected = [], changes = [];
        const key = value => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true }));
        const focused = () => document.activeElement.textContent.trim();
        function RenameInput({ close }) {
          const input = React.useRef(null);
          React.useEffect(() => { input.current.focus(); }, []);
          return <input ref={input} id="rename-input" aria-label="Rename" onBlur={close} />;
        }
        function Fixture() {
          const [open, setOpen] = React.useState(false);
          const [renaming, setRenaming] = React.useState(false);
          return <>
            <button id="invoke" onClick={() => setOpen(true)}>Invoke</button>
            <button id="outside">Outside</button>
            {renaming && <RenameInput close={() => setRenaming(false)} />}
            {open && <ActionMenu open={open} point={{ x: innerWidth - 3, y: innerHeight - 3 }}
              aria-label="Workspace commands" className="consumer-menu"
              onOpenChange={value => { changes.push(value); setOpen(value); }}
              items={[
                { id: 'first', label: 'First', group: 'Workspace', shortcut: '⌘1', onSelect: () => selected.push('first') },
                { id: 'disabled', label: 'Disabled', group: 'Workspace', disabled: true, onSelect: () => selected.push('disabled') },
                { id: 'more', label: 'More', group: 'Workspace', items: [
                  { id: 'disabled-child', label: 'Disabled child', disabled: true, onSelect: () => selected.push('disabled-child') },
                  { id: 'child', label: 'Child', onSelect: () => selected.push('child') },
                  { id: 'last-child', label: 'Last child', onSelect: () => selected.push('last-child') },
                ] },
                { id: 'keep', label: 'Keep open', group: 'Other', onSelect: event => { event.preventDefault(); selected.push('keep'); } },
                { id: 'rename', label: 'Rename', group: 'Other', onSelect: () => setRenaming(true) },
                { id: 'last', label: 'Last', group: 'Other', onSelect: () => selected.push('last') },
              ]} />}
          </>;
        }
        async function open() {
          const invoke = document.getElementById('invoke');
          invoke.focus(); flushSync(() => invoke.click()); await pause();
        }
        (async () => {
          flushSync(() => root.render(<Fixture />));
          await open();
          const menu = document.querySelector('[data-slot="action-menu"]');
          const rect = menu.getBoundingClientRect();
          const output = {
            label: menu.getAttribute('aria-label'), classForwarded: menu.classList.contains('consumer-menu'),
            groups: [...menu.querySelectorAll('[data-slot="menu-label"]')].map(node => node.textContent),
            collision: rect.left >= 7 && rect.top >= 7 && rect.right <= innerWidth - 7 && rect.bottom <= innerHeight - 7,
            initial: focused(),
          };
          key('ArrowDown'); await pause(); output.skipsDisabled = focused();
          key('ArrowRight'); await pause(); output.childFocus = focused();
          output.childMenu = !!document.querySelector('[data-slot="menu-sub-content"]');
          key('ArrowLeft'); await pause(); output.parentFocus = focused();
          output.childClosed = !document.querySelector('[data-slot="menu-sub-content"]');
          key('End'); await pause(); output.end = focused();
          key('ArrowDown'); await pause(); output.wraps = focused();
          key('Escape'); await pause(); output.escapeClosed = !document.querySelector('[data-slot="action-menu"]');
          output.escapeFocus = document.activeElement.id;
          await open(); key('k'); await pause(); output.typeahead = focused();
          key('Enter'); await pause(); output.preventedSelectionOpen = !!document.querySelector('[data-slot="action-menu"]');
          key('Home'); await pause(); key('ArrowDown'); await pause(); key('ArrowRight'); await pause();
          key('Enter'); await pause(); output.selectedClosed = !document.querySelector('[data-slot="action-menu"]');
          output.selectedFocus = document.activeElement.id;
          await open();
          const outside = document.getElementById('outside');
          outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'mouse', button: 0 }));
          outside.focus(); await pause();
          output.outsideClosed = !document.querySelector('[data-slot="action-menu"]');
          output.outsideFocus = document.activeElement.id;
          await open(); key('r'); await pause(); key('Enter'); await pause();
          output.renameFocus = document.activeElement.id;
          output.renameVisible = !!document.getElementById('rename-input');
          output.selected = selected; output.changes = changes;
          document.getElementById('results').textContent = JSON.stringify(output);
        })().catch(error => document.getElementById('results').textContent = JSON.stringify({ error: String(error) }));
      `);
      const build = await Bun.build({ entrypoints: [entry], outdir: scratch, target: "browser" });
      expect(build.success).toBe(true);
      writeFileSync(join(scratch, "index.html"), '<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="onyx.css"><style>*,*::before,*::after{animation:none!important;transition:none!important}</style><div id="root"></div><pre id="results"></pre><script src="entry.js"></script>');
      const proc = Bun.spawn([shell!, "--no-sandbox", "--allow-file-access-from-files", "--virtual-time-budget=8000", "--dump-dom", `file://${join(scratch, "index.html")}`], { stdout: "pipe", stderr: "pipe" });
      const [dom, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
      expect(code).toBe(0);
      const json = dom.match(/<pre id="results"[^>]*>([^<]+)<\/pre>/)?.[1];
      expect(json, stderr).toBeTruthy();
      const output = JSON.parse(json!);
      expect(output.error).toBeUndefined();
      expect(output.changes.length).toBeGreaterThanOrEqual(4);
      expect(output.changes.every(value => value === false)).toBe(true);
      delete output.changes;
      expect(output).toEqual({
        label: "Workspace commands", classForwarded: true, groups: ["Workspace", "Other"], collision: true,
        initial: "First⌘1", skipsDisabled: "More", childFocus: "Child", childMenu: true,
        parentFocus: "More", childClosed: true, end: "Last", wraps: "First⌘1",
        escapeClosed: true, escapeFocus: "invoke", selectedClosed: true, selectedFocus: "invoke",
        typeahead: "Keep open", preventedSelectionOpen: true,
        outsideClosed: true, outsideFocus: "outside", selected: ["keep", "child"],
        renameFocus: 'rename-input', renameVisible: true,
      });
    } finally { rmSync(scratch, { recursive: true, force: true }); }
  });
});
