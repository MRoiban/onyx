import { describe, it, expect } from 'bun:test';
import { render, fireEvent, act, waitFor, renderHook } from '@testing-library/react';
import { Button, buttonVariants } from '../src/components/button';
import { Toolbar } from '../src/components/toolbar';
import { SidebarRail, SidebarProvider, Sidebar } from '../src/components/sidebar';
import { Command, CommandInput } from '../src/components/command';
import { SectionSelect } from '../src/components/section-select';
import { useFloatingPosition } from '../src/lib/use-floating-position';

describe('fix B shared regressions', () => {
  it('SidebarRail preserves the standalone HEAD div and consumer handlers', () => {
    let clicks = 0, keys = 0, pointers = 0;
    const ref = { current: null as HTMLDivElement | null };
    const view = render(<SidebarRail ref={ref} className="custom" onClick={() => clicks++} onKeyDown={() => keys++} onPointerDown={() => pointers++} />);
    const rail = view.container.firstElementChild as HTMLElement;
    expect(rail.tagName).toBe('DIV');
    expect(rail.getAttribute('role')).toBeNull();
    expect(rail.className).toContain('w-1');
    expect(rail.className).toContain('custom');
    expect(ref.current).toBe(rail as HTMLDivElement);
    fireEvent.click(rail); fireEvent.keyDown(rail, { key: 'ArrowRight' }); fireEvent.pointerDown(rail);
    expect([clicks, keys, pointers]).toEqual([1, 1, 1]);
  });
  it('SidebarRail keeps provider ResizeHandle keyboard resizing', () => {
    const values: number[] = [];
    const view = render(<SidebarProvider><Sidebar><SidebarRail width={240} onWidthChange={(value) => values.push(value)} /></Sidebar></SidebarProvider>);
    const rail = view.getByRole('separator');
    fireEvent.keyDown(rail, { key: 'ArrowRight' });
    expect(values.length).toBe(1);
    expect(values[0]).toBeGreaterThan(240);
  });
  it('blocked asChild Button never invokes child or consumer activation handlers', () => {
    for (const state of [{ loading: true }, { disabled: true }]) {
      const calls: string[] = [];
      const record = (name: string) => () => { calls.push(name); };
      const view = render(<Button asChild {...state} onClick={record('parent-click')} onClickCapture={record('parent-capture')} onPointerDown={record('parent-pointer')} onKeyDown={record('parent-key')}><a href="/publish" onClickCapture={record('child-capture')} onClick={record('child-click')} onPointerDown={record('child-pointer')} onKeyDown={record('child-key')}>Publish</a></Button>);
      const link = view.getByRole('link');
      fireEvent.click(link); fireEvent.pointerDown(link); fireEvent.keyDown(link, { key: 'Enter' }); fireEvent.keyDown(link, { key: ' ' });
      expect(calls).toEqual([]);
      view.unmount();
    }
  });
  it('editing widgets retain independent tab stops and native keys beside toolbar actions', () => {
    const view = render(<Toolbar><button>A</button><input aria-label="Edit" /><textarea aria-label="Text" /><div contentEditable role="textbox" aria-label="Rich" /><button role="combobox">Choose</button><button>Z</button></Toolbar>);
    const a = view.getByText('A'), z = view.getByText('Z');
    for (const editor of [view.getByLabelText('Edit'), view.getByLabelText('Text'), view.getByLabelText('Rich'), view.getByRole('combobox')]) {
      expect(editor.tabIndex).toBe(0);
      act(() => editor.focus());
      expect(fireEvent.keyDown(editor, { key: 'ArrowRight' })).toBe(true);
      expect(fireEvent.keyDown(editor, { key: 'Tab' })).toBe(true);
      expect(fireEvent.keyDown(editor, { key: 'Tab', shiftKey: true })).toBe(true);
      expect(document.activeElement).toBe(editor);
    }
    act(() => a.focus()); fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(z);
    expect(a.tabIndex).toBe(-1);
  });
  it('roving focus excludes hidden, disabled, inert, aria-hidden and CSS-hidden candidates', () => {
    const view = render(<Toolbar><input type="hidden" /><button hidden>Hidden</button><button style={{ display: 'none' }}>Display</button><div style={{ visibility: 'hidden' }}><button>Visibility</button></div><button disabled>Disabled</button><div inert><button>Inert</button></div><div aria-hidden="true"><button>Aria</button></div><button>Available</button></Toolbar>);
    const buttons = view.container.querySelectorAll('button, input');
    for (const button of buttons) expect((button as HTMLElement).tabIndex).toBe(button.textContent === 'Available' ? 0 : -1);
  });
  it('roving focus refreshes dynamic ancestor inert hidden and disabled changes', async () => {
    const view = render(<Toolbar><div data-testid="ancestor"><button>A</button></div><button>B</button></Toolbar>);
    const a = view.getByText('A'), b = view.getByText('B'), ancestor = view.getByTestId('ancestor');
    for (const attribute of ['inert', 'hidden', 'aria-hidden']) {
      act(() => ancestor.setAttribute(attribute, attribute === 'aria-hidden' ? 'true' : ''));
      await waitFor(() => expect(a.tabIndex).toBe(-1));
      expect(b.tabIndex).toBe(0);
      act(() => ancestor.removeAttribute(attribute));
      await waitFor(() => { act(() => { b.focus(); a.focus(); }); expect(a.tabIndex).toBe(0); });
    }
    act(() => a.setAttribute('disabled', ''));
    await waitFor(() => expect(a.tabIndex).toBe(-1));
    expect(b.tabIndex).toBe(0);
  });
  it('floating width restores consumer width when matching is turned off and on cleanup', async () => {
    for (const originalWidth of ['37px', '']) {
    const reference = document.createElement('button'), floating = document.createElement('div');
    reference.getBoundingClientRect = () => ({ x: 0, y: 0, width: 120, height: 20, top: 0, left: 0, bottom: 20, right: 120, toJSON() {} });
    floating.style.width = originalWidth;
    document.body.append(reference, floating);
    const hook = renderHook(({ matchWidth }) => useFloatingPosition({ matchWidth }), { initialProps: { matchWidth: true } });
    act(() => { hook.result.current.refs.setReference(reference); hook.result.current.refs.setFloating(floating); });
    await waitFor(() => expect(floating.style.width).toBe('120px'));
    hook.rerender({ matchWidth: false });
    await waitFor(() => expect(floating.style.width).toBe(originalWidth));
    hook.rerender({ matchWidth: true });
    await waitFor(() => expect(floating.style.width).toBe('120px'));
    hook.unmount();
    expect(floating.style.width).toBe(originalWidth);
    reference.remove(); floating.remove();
    }
  });
  it('compact Button hit areas preserve visible geometry and expand centrally to 24px', () => {
    for (const size of ['xs', 'icon-xs'] as const) {
      const classes = buttonVariants({ size });
      expect(classes).toContain('after:min-h-[var(--onyx-space-6)]');
      expect(classes).toContain('after:min-w-[var(--onyx-space-6)]');
      expect(classes).toContain('after:absolute');
      expect(classes).toContain('h-[var(--onyx-control-height-xs)]');
      expect(classes).toContain('after:left-1/2');
    }
  });
  it('SectionSelect and CommandInput expose token focus rings without doubling the command border', () => {
    const view = render(<><SectionSelect ariaLabel="Section" onValueChange={() => {}} value="a" items={[{ value: 'a', label: 'Alpha', icon: 'check' }]} /><Command><CommandInput /></Command></>);
    expect(view.container.querySelector('[data-slot=section-select-trigger]')!.className).toContain('focus-visible:ring-[var(--onyx-control-focus-ring)]');
    expect(view.container.querySelector('[data-slot=command-input]')!.className).not.toContain('focus-visible:ring-');
    expect(view.container.querySelector('[data-slot=command-input-shell]')!.className).toContain('focus-within:ring-[var(--onyx-control-focus-ring)]');
  });
});
