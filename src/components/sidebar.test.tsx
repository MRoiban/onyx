import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import {
  SidebarProvider,
  useSidebar,
  WorkbenchSidebar
} from './sidebar';

function SidebarMobileProbe(): React.ReactElement {
  const sidebar = useSidebar();
  return <span data-mobile={sidebar.isMobile ? 'yes' : 'no'} />;
}

describe('sidebar primitives', () => {
  it('uses the injected environment for mobile sidebar state', () => {
    const html = renderToStaticMarkup(
      <SidebarProvider environment={{ matchMedia: () => ({ matches: true }) }}>
        <SidebarMobileProbe />
      </SidebarProvider>
    );

    expect(html).toContain('data-mobile="yes"');
  });

  it('renders WorkbenchSidebar without requiring browser globals', () => {
    const html = renderToStaticMarkup(
      <WorkbenchSidebar
        activityBarVisible={false}
        activityItems={[]}
        environment={{ document: null, window: null }}
        onActivityBarVisibleChange={() => {}}
        onOpenChange={() => {}}
        open={true}
      >
        <div>Sidebar content</div>
      </WorkbenchSidebar>
    );

    expect(html).toContain('data-slot="workbench-sidebar"');
    expect(html).toContain('Sidebar content');
  });

  it('keeps browser globals and body mutation out of the sidebar React component', () => {
    const source = readFileSync(new URL('./sidebar.tsx', import.meta.url), 'utf8');

    expect(source).not.toContain('typeof window');
    expect(source).not.toContain('matchMedia');
    expect(source).not.toContain('getBoundingClientRect');
    expect(source).not.toContain('document.body');
    expect(source).not.toContain('body.style');
    expect(source).not.toContain('window.addEventListener');
    expect(source).not.toContain('window.removeEventListener');
  });
});
