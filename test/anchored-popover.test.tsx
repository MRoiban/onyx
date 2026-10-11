import { describe, expect, it } from 'bun:test';
import * as React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AnchoredPopover, type AnchoredPopoverProps } from '../src/components/anchored-popover';
import { PopoverClose, PortalContainerProvider } from '../src/components/popover';

function Fixture({ contentProps = {}, inheritedHost, forwardedRef }: {
  contentProps?: Partial<AnchoredPopoverProps>;
  inheritedHost?: HTMLElement;
  forwardedRef?: React.Ref<HTMLDivElement>;
}) {
  const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState(true);
  return <PortalContainerProvider value={inheritedHost ?? null}>
    <button>Before</button>
    <button ref={setAnchor} onClick={() => setOpen(value => !value)}>Anchor</button>
    <button>After</button>
    <AnchoredPopover anchor={anchor} open={open} onOpenChange={setOpen}
      aria-label="Connection" ref={forwardedRef} {...contentProps}>
      <button disabled>Disabled</button>
      <button>First</button><PopoverClose>Last</PopoverClose>
    </AnchoredPopover>
  </PortalContainerProvider>;
}

describe('AnchoredPopover external control ownership', () => {
  it('renders no surface without an anchor', () => {
    render(<AnchoredPopover anchor={null} onOpenChange={() => {}}>Missing</AnchoredPopover>);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.queryByText('Missing')).toBeNull();
  });

  it('inherits the modal portal host, forwards content props/ref and focuses the first enabled control', async () => {
    const host = document.createElement('section');
    document.body.append(host);
    const ref = React.createRef<HTMLDivElement>();
    try {
      render(<Fixture inheritedHost={host} forwardedRef={ref}
        contentProps={{ className: 'custom-surface', style: { width: 280 }, side: 'top', align: 'end' }} />);
      await waitFor(() => expect(document.activeElement).toBe(screen.getByText('First')));
      expect(host.contains(screen.getByRole('dialog', { name: 'Connection' }))).toBe(true);
      expect(ref.current?.dataset.slot).toBe('anchored-popover');
      expect(ref.current?.classList.contains('custom-surface')).toBe(true);
      expect(ref.current?.style.width).toBe('280px');
      expect(document.querySelector('[data-slot="popover-anchor"]')).toBeNull();
      fireEvent.keyDown(screen.getByText('First'), { key: 'Escape' });
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await waitFor(() => expect(document.activeElement).toBe(screen.getByText('Anchor')));
    } finally { host.remove(); }
  });

  it('ignores pointer/focus on the external anchor and retains outside focus on dismissal', async () => {
    render(<Fixture />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('First')));
    await act(async () => new Promise(resolve => setTimeout(resolve, 10)));
    fireEvent.pointerDown(screen.getByText('Anchor'), { button: 0 });
    act(() => screen.getByText('Anchor').focus());
    expect(screen.getByRole('dialog')).toBeTruthy();
    await act(async () => new Promise(resolve => setTimeout(resolve, 10)));
    act(() => screen.getByText('First').focus());
    fireEvent.pointerDown(screen.getByText('After'), { button: 0 });
    act(() => screen.getByText('After').focus());
    fireEvent.click(screen.getByText('After'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await act(async () => new Promise(resolve => setTimeout(resolve, 10)));
    expect(document.activeElement).toBe(screen.getByText('After'));
  });

  it('returns focus after a PopoverClose action and lets consumers prevent Escape dismissal', async () => {
    let escapeCalls = 0;
    render(<Fixture contentProps={{ onEscapeKeyDown: event => { escapeCalls++; event.preventDefault(); } }} />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('First')));
    fireEvent.keyDown(screen.getByText('First'), { key: 'Escape' });
    expect(escapeCalls).toBe(1);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByText('Last'));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('Anchor')));
  });

  it('leaves nonmodal content at Tab boundaries without looping, skipping disabled controls', async () => {
    render(<Fixture />);
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('First')));
    fireEvent.keyDown(screen.getByText('First'), { key: 'Tab' });
    expect(screen.getByRole('dialog')).toBeTruthy();
    act(() => screen.getByText('Last').focus());
    fireEvent.keyDown(screen.getByText('Last'), { key: 'Tab' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('After')));
    fireEvent.click(screen.getByText('Anchor'));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('First')));
    fireEvent.keyDown(screen.getByText('First'), { key: 'Tab', shiftKey: true });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(screen.getByText('Anchor')));
  });

  it('honors explicit portal override and preventable opening/outside/closing focus events', async () => {
    const inherited = document.createElement('section'), override = document.createElement('section');
    document.body.append(inherited, override);
    let closes = 0;
    try {
      render(<Fixture inheritedHost={inherited} contentProps={{ container: override,
        onOpenAutoFocus: event => event.preventDefault(),
        onInteractOutside: event => event.preventDefault(),
        onCloseAutoFocus: event => { closes++; event.preventDefault(); },
      }} />);
      await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
      expect(override.contains(screen.getByRole('dialog'))).toBe(true);
      expect(inherited.contains(screen.getByRole('dialog'))).toBe(false);
      act(() => screen.getByText('After').focus());
      expect(screen.getByRole('dialog')).toBeTruthy();
      fireEvent.click(screen.getByText('Last'));
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
      await waitFor(() => expect(closes).toBe(1));
      expect(document.activeElement).toBe(screen.getByText('After'));
    } finally { inherited.remove(); override.remove(); }
  });
});
