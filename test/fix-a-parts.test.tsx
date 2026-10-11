import { describe, expect, it } from 'bun:test';
import { createRef } from 'react';
import { render } from '@testing-library/react';
import { Text, Heading, SectionLabel } from '../src/components/text';
import { Dialog, DialogTrigger, DialogClose, DialogHeader, DialogFooter } from '../src/components/dialog';
import { OnyxThemeRoot } from '../src/components/theme';
import { createOnyxThemeStyleMap, getOnyxThemeRebindings, type OnyxThemeVariables } from '../src/theme/tokens';

describe('fix A public parts', () => {
  it('text and dialog structural parts compose slots, classes and refs through asChild', () => {
    for (const [Comp, slot] of [[Text, 'text'], [Heading, 'heading'], [SectionLabel, 'section-label'], [DialogHeader, 'dialog-header'], [DialogFooter, 'dialog-footer']] as const) {
      const ref = createRef<any>();
      const { unmount } = render(<Comp asChild ref={ref} className="consumer"><article>Content</article></Comp>);
      expect(ref.current.tagName).toBe('ARTICLE');
      expect(ref.current.dataset.slot).toBe(slot);
      expect(ref.current.classList.contains('consumer')).toBe(true);
      unmount();
    }
  });
  it('dialog action parts expose slots and forward refs', () => {
    const trigger = createRef<HTMLButtonElement>(), close = createRef<HTMLButtonElement>();
    render(<Dialog><DialogTrigger ref={trigger}>Open</DialogTrigger><DialogClose ref={close}>Close</DialogClose></Dialog>);
    expect(trigger.current?.dataset.slot).toBe('dialog-trigger');
    expect(close.current?.dataset.slot).toBe('dialog-close');
  });
  it('theme variables accept public component keys and the exact-name escape hatch', () => {
    const variables: OnyxThemeVariables = { cardBg: 'red', sliderThumbSize: '2rem', badgeHeight: '2rem', '--onyx-consumer-extension': '42' };
    expect(createOnyxThemeStyleMap(variables)).toEqual({ '--onyx-card-bg': 'red', '--onyx-slider-thumb-size': '2rem', '--onyx-badge-height': '2rem', '--onyx-consumer-extension': '42' });
  });
  it('theme roots request only affected aliases and preserve explicit variables', () => {
    const variables = { paletteBlue600: 'red', surfacePanel: 'blue', surfaceSidebar: 'orange' };
    const { container } = render(<OnyxThemeRoot variables={variables} />);
    const root = container.firstElementChild!;
    expect(root.hasAttribute('data-theme')).toBe(false);
    expect(root.getAttribute('data-onyx-rebind')?.split(' ')).toContain('--onyx-control-button-bg');
    expect(getOnyxThemeRebindings(variables)).toContain('--onyx-shell-tabs-bg');
    expect(getOnyxThemeRebindings(variables)).not.toContain('--onyx-surface-sidebar');
    expect(getOnyxThemeRebindings({ buttonRadius: '1rem' })).toEqual([]);
  });
});
