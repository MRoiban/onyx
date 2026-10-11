import type { ReactNode } from 'react';
import { Button } from '../src/button';
import { Input } from '../src/input';
import { Code } from '../src/text';
export function Foundations({ actions }: { actions?: ReactNode }) {
  return (
    <>
      <section className="g-sec">
        <h2>0 · Theming model</h2>
        <div className="g-grid">
          <div className="g-cell wide">
            <h3>
              Three token tiers <code>palette → semantic → component</code>
            </h3>
            <div
              className="code-block"
              dangerouslySetInnerHTML={{
                __html:
                  '/* 1. palette \u2014 raw ramps, swap to rebrand everything */\n<b>--onyx-palette-blue-600</b>: #205EA6;\n/* 2. semantic \u2014 the public theme API every component reads */\n<b>--onyx-control-button-bg</b>: var(--onyx-palette-blue-600);\n<b>--onyx-tone-danger-fg</b>: var(--onyx-palette-red-400);\n/* 3. component \u2014 defaults to semantic; override one component alone */\n<b>--onyx-button-radius</b>: var(--onyx-radius-md);\n<b>--onyx-menu-item-height</b>: var(--onyx-control-height-md);\n\n<em>/* Styling hooks on every part */</em>\n&lt;button data-slot="button" data-variant="secondary" data-size="sm" data-state="loading"&gt;\n<em>/* All Onyx CSS lives in @layer onyx.base, onyx.components \u2192 app CSS wins, no !important */</em>',
              }}
            />
            <p className="g-note">
              Every primitive: tokens only (no raw hex/px),{' '}
              <Code>data-slot</Code> on each part, <Code>data-state</Code>/
              <Code>data-variant</Code>/<Code>data-size</Code>/
              <Code>data-tone</Code> hooks, <Code>className</Code> merge,{' '}
              <Code>asChild</Code>, exported variant functions, and a headless
              hook where behaviour is non-trivial (<Code>useListbox</Code>,{' '}
              <Code>useTree</Code>, <Code>useResizable</Code>,{' '}
              <Code>useFloating</Code>…).
            </p>
          </div>
          <div className="g-cell">
            <h3>
              Default <code>no overrides</code>
            </h3>
            <div className="theme-demo">
              <div className="field">
                <label className="label" htmlFor="workspace-0">
                  Workspace
                </label>
                <Input
                  id="workspace-0"
                  className="input"
                  defaultValue="babel-translations"
                />
              </div>
              <div className="row">
                <Button>Create</Button>
                <Button variant="secondary">Cancel</Button>
                <span className="badge" data-tone="success">
                  <i className="codicon codicon-check" aria-hidden="true"></i>
                  Synced
                </span>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Re-themed <code>tokens only</code>
            </h3>
            <div className="theme-demo theme-custom">
              <div className="field">
                <label className="label" htmlFor="workspace-1">
                  Workspace
                </label>
                <Input
                  id="workspace-1"
                  className="input"
                  defaultValue="babel-translations"
                />
              </div>
              <div className="row">
                <Button>Create</Button>
                <Button variant="secondary">Cancel</Button>
                <span className="badge" data-tone="success">
                  <i className="codicon codicon-check" aria-hidden="true"></i>
                  Synced
                </span>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Re-themed <code>tokens only</code>
            </h3>
            <div className="theme-demo theme-term">
              <div className="field">
                <label className="label" htmlFor="workspace-2">
                  Workspace
                </label>
                <Input
                  id="workspace-2"
                  className="input"
                  defaultValue="babel-translations"
                />
              </div>
              <div className="row">
                <Button>Create</Button>
                <Button variant="secondary">Cancel</Button>
                <span className="badge" data-tone="success">
                  <i className="codicon codicon-check" aria-hidden="true"></i>
                  Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="g-sec">
        <h2>1 · Foundations</h2>
        <div className="g-grid">
          <div className="g-cell wide">
            <h3>
              Tones <code>{'--onyx-tone-{name}-{fg,bg,border,solid}'}</code>
            </h3>
            <div className="col">
              <div
                className="tone-row"
                style={{ color: 'var(--onyx-text-description)' }}
              >
                <span></span>
                <span>fg</span>
                <span>bg</span>
                <span>border</span>
                <span>solid</span>
              </div>
              <div className="tone-row" data-tone="neutral">
                <span>neutral</span>
                <div style={{ color: 'var(--fg)' }}>Aa</div>
                <div style={{ background: 'var(--bg)' }}></div>
                <div style={{ border: '2px solid var(--b)' }}></div>
                <div
                  style={{
                    background: 'var(--solid)',
                    color: 'var(--solid-fg)',
                  }}
                >
                  Aa
                </div>
              </div>
              <div className="tone-row" data-tone="info">
                <span>info</span>
                <div style={{ color: 'var(--fg)' }}>Aa</div>
                <div style={{ background: 'var(--bg)' }}></div>
                <div style={{ border: '2px solid var(--b)' }}></div>
                <div
                  style={{
                    background: 'var(--solid)',
                    color: 'var(--solid-fg)',
                  }}
                >
                  Aa
                </div>
              </div>
              <div className="tone-row" data-tone="success">
                <span>success</span>
                <div style={{ color: 'var(--fg)' }}>Aa</div>
                <div style={{ background: 'var(--bg)' }}></div>
                <div style={{ border: '2px solid var(--b)' }}></div>
                <div
                  style={{
                    background: 'var(--solid)',
                    color: 'var(--solid-fg)',
                  }}
                >
                  Aa
                </div>
              </div>
              <div className="tone-row" data-tone="warning">
                <span>warning</span>
                <div style={{ color: 'var(--fg)' }}>Aa</div>
                <div style={{ background: 'var(--bg)' }}></div>
                <div style={{ border: '2px solid var(--b)' }}></div>
                <div
                  style={{
                    background: 'var(--solid)',
                    color: 'var(--solid-fg)',
                  }}
                >
                  Aa
                </div>
              </div>
              <div className="tone-row" data-tone="danger">
                <span>danger</span>
                <div style={{ color: 'var(--fg)' }}>Aa</div>
                <div style={{ background: 'var(--bg)' }}></div>
                <div style={{ border: '2px solid var(--b)' }}></div>
                <div
                  style={{
                    background: 'var(--solid)',
                    color: 'var(--solid-fg)',
                  }}
                >
                  Aa
                </div>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>Borders &amp; surfaces</h3>
            <div className="tok-grid">
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-border-subtle)' }}
                ></span>
                <code>border-subtle</code>
              </div>
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-border-default)' }}
                ></span>
                <code>border-default</code>
              </div>
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-border-strong)' }}
                ></span>
                <code>border-strong</code>
              </div>
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-surface-raised)' }}
                ></span>
                <code>surface-raised</code>
              </div>
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-surface-tooltip)' }}
                ></span>
                <code>surface-tooltip</code>
              </div>
              <div className="tok">
                <span
                  className="swatch"
                  style={{ background: 'var(--onyx-control-track)' }}
                ></span>
                <code>control-track</code>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Spacing <code>--onyx-space-*</code>
            </h3>
            <div className="col" style={{ gap: '4px' }}>
              <div className="type-row">
                <code>space-1 · 4</code>
                <div className="space-bar" style={{ width: '4px' }}></div>
              </div>
              <div className="type-row">
                <code>space-2 · 8</code>
                <div className="space-bar" style={{ width: '8px' }}></div>
              </div>
              <div className="type-row">
                <code>space-3 · 12</code>
                <div className="space-bar" style={{ width: '12px' }}></div>
              </div>
              <div className="type-row">
                <code>space-4 · 16</code>
                <div className="space-bar" style={{ width: '16px' }}></div>
              </div>
              <div className="type-row">
                <code>space-6 · 24</code>
                <div className="space-bar" style={{ width: '24px' }}></div>
              </div>
              <div className="type-row">
                <code>space-8 · 32</code>
                <div className="space-bar" style={{ width: '32px' }}></div>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Type <code>--onyx-text-* · font-mono</code>
            </h3>
            <div className="col" style={{ gap: '2px' }}>
              <div className="type-row">
                <code>text-2xl</code>
                <span
                  style={{
                    fontSize: 'var(--onyx-text-2xl)',
                    fontWeight: '600',
                  }}
                >
                  Settings
                </span>
              </div>
              <div className="type-row">
                <code>text-xl</code>
                <span
                  style={{ fontSize: 'var(--onyx-text-xl)', fontWeight: '600' }}
                >
                  Workspace
                </span>
              </div>
              <div className="type-row">
                <code>text-lg</code>
                <span style={{ fontSize: 'var(--onyx-text-lg)' }}>
                  Section title
                </span>
              </div>
              <div className="type-row">
                <code>text-md</code>
                <span>Body and controls</span>
              </div>
              <div className="type-row">
                <code>text-sm</code>
                <span style={{ fontSize: 'var(--onyx-text-sm)' }}>
                  Descriptions, meta
                </span>
              </div>
              <div className="type-row">
                <code>text-xs</code>
                <span style={{ fontSize: 'var(--onyx-text-xs)' }}>
                  Badges, labels
                </span>
              </div>
              <div className="type-row">
                <code>font-mono</code>
                <span style={{ fontFamily: 'var(--onyx-font-mono)' }}>
                  i18n/fr.json:42
                </span>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Control heights <code>--onyx-control-height-*</code>
            </h3>
            <div className="row" style={{ alignItems: 'flex-end' }}>
              <Button variant="secondary" size="xs">
                xs
              </Button>
              <Button variant="secondary" size="sm">
                sm
              </Button>
              <Button variant="secondary">md</Button>
              <Button variant="secondary" size="lg">
                lg
              </Button>
            </div>
            <p className="g-note">
              Compact: 20 / 24 / 28 / 32. Comfortable: 24 / 30 / 36 / 40. Switch
              with <Code>data-density</Code> on any ancestor.
            </p>
          </div>
          <div className="g-cell">
            <h3>Motion &amp; focus</h3>
            <div
              className="col"
              style={{ gap: '6px', fontSize: 'var(--onyx-text-sm)' }}
            >
              <div className="tok">
                <code>duration-fast 100 · normal 160 · slow 240</code>
              </div>
              <div className="tok">
                <code>ease-standard · ease-emphasized · ease-exit</code>
              </div>
              <div className="row">
                <Button className="focus-demo" variant="secondary">
                  Focus ring
                </Button>
                <span className="g-note" style={{ margin: '0' }}>
                  2px ring, 1px offset; reduced-motion collapses durations.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="g-sec">
        <h2>2 · Actions</h2>
        <div className="g-grid">
          <div className="g-cell">
            <h3>
              Button states <code>loading · pressed</code>
            </h3>
            <div className="col">
              <div className="row">
                <Button loading>
                  <span className="btn-label">Publishing…</span>
                </Button>
                <Button variant="secondary" pressed>
                  <i className="codicon codicon-pin" aria-hidden="true"></i>
                  Pinned
                </Button>
              </div>
              <div className="row">
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">
                  <i className="codicon codicon-trash" aria-hidden="true"></i>
                  Delete
                </Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
          <div className="g-cell">
            <h3>
              Compact icon buttons <code>icon · icon-sm · icon-xs</code>
            </h3>
            <div className="row">
              <Button variant="ghost" size="icon" aria-label="Refresh">
                <i className="codicon codicon-refresh" aria-hidden="true"></i>
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="New file">
                <i className="codicon codicon-new-file" aria-hidden="true"></i>
              </Button>
              <Button variant="ghost" size="icon-sm" aria-label="Collapse">
                <i
                  className="codicon codicon-collapse-all"
                  aria-hidden="true"
                ></i>
              </Button>
              <Button variant="ghost" size="icon-xs" aria-label="Close">
                <i className="codicon codicon-close" aria-hidden="true"></i>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Loading"
                loading
              ></Button>
            </div>
            <p className="g-note">
              Replaces <Code>.search-btn</Code>, <Code>.cloud-popover-btn</Code>
              , <Code>.ctx-btn</Code> and similar hand-made classes.
            </p>
          </div>

          {actions}
        </div>
      </section>
    </>
  );
}
