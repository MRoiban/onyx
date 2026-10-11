import { describe, expect, it } from 'bun:test';
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveChromium } from './browser';

const shell = resolveChromium();
const suites = ['test/fix2-b-button-browser.test.tsx', 'test/fix2-d-browser.test.tsx'];

async function runSuites(withBrowser: boolean) {
  const scratch = mkdtempSync(join(tmpdir(), 'onyx-fix3-discovery-'));
  try {
    const home = join(scratch, 'test-home');
    mkdirSync(home);
    if (withBrowser) {
      const directory = join(home, '.cache/ms-playwright/chromium_headless_shell-9999/chrome-headless-shell-linux64');
      mkdirSync(directory, { recursive: true });
      const executable = join(directory, 'chrome-headless-shell');
      writeFileSync(executable, `#!/bin/sh\nexec '${shell!.replaceAll("'", "'\\''")}' "$@"\n`);
      chmodSync(executable, 0o755);
    }
    const preload = join(scratch, 'home.ts');
    // Inject only discovery's home in a child process; preserve the real HOME.
    writeFileSync(preload, `import { mock } from 'bun:test'; import * as os from 'node:os';
      const actual = { ...os }; mock.module('node:os', () => ({ ...actual, homedir: () => ${JSON.stringify(home)} }));`);
    const process = Bun.spawn([Bun.which('bun')!, 'test', '--preload', preload, ...suites], {
      cwd: globalThis.process.cwd(),
      env: { ...globalThis.process.env, CI: '1', ONYX_CHROMIUM: undefined },
      stdout: 'pipe', stderr: 'pipe',
    });
    const [stdout, stderr, code] = await Promise.all([new Response(process.stdout).text(), new Response(process.stderr).text(), process.exited]);
    return { output: stdout + stderr, code };
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}

describe('Final review browser discovery integration', () => {
  (shell ? it : it.skip)('runs B/D browser suites in CI with only a Linux-layout browser cache', async () => {
    const result = await runSuites(true);
    expect(result.code, result.output).toBe(0);
    expect(result.output).toContain('3 pass');
    expect(result.output).toContain('0 fail');
    expect(result.output).not.toContain('(skip)');
  }, 15000);

  it('both B/D suites fail clearly in CI when no browser exists', async () => {
    const result = await runSuites(false);
    expect(result.code).not.toBe(0);
    expect(result.output.match(/error: Onyx browser tests require Chromium in CI/g)?.length).toBe(2);
    expect(result.output).not.toContain('(skip)');
  });
});
