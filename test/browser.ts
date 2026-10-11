import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface ChromiumOptions {
  env?: Record<string, string | undefined>;
  home?: string;
}

/** Shared shell discovery for browser tests; CI must never silently skip them. */
export function resolveChromium({ env = process.env, home = homedir() }: ChromiumOptions = {}): string | undefined {
  if (env.ONYX_CHROMIUM) {
    if (existsSync(env.ONYX_CHROMIUM)) return env.ONYX_CHROMIUM;
    throw new Error(`ONYX_CHROMIUM does not exist: ${env.ONYX_CHROMIUM}`);
  }
  for (const cache of [join(home, 'Library/Caches/ms-playwright'), join(home, '.cache/ms-playwright')]) {
    if (!existsSync(cache)) continue;
    for (const revision of readdirSync(cache).filter(name => name.startsWith('chromium_headless_shell-')).sort().reverse()) {
      const root = join(cache, revision);
      for (const platform of readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
        for (const executable of ['chrome-headless-shell', 'headless_shell']) {
          const candidate = join(root, platform.name, executable);
          if (existsSync(candidate)) return candidate;
        }
      }
    }
  }
  if (env.CI) throw new Error('Onyx browser tests require Chromium in CI. Set ONYX_CHROMIUM to its executable or install Playwright chromium-headless-shell.');
  return undefined;
}
