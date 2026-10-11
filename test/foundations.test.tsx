import { describe, it, expect } from 'bun:test';
import { render, fireEvent, renderHook, act } from '@testing-library/react';
import { Button } from '../src/button';
import { Toolbar, ToolbarButton } from '../src/toolbar';
import {
  useRovingFocus,
  useControllableState,
  composeRefs,
} from '../src/hooks';
describe('Button', () => {
  it('keeps a measured width when loading starts', () => {
    const view = render(<Button>Publish</Button>);
    const button = view.getByRole('button') as HTMLButtonElement;
    button.getBoundingClientRect = () => ({ width: 96 }) as DOMRect;
    view.rerender(<Button>Publish</Button>);
    view.rerender(<Button loading>Publish</Button>);
    expect(button.style.width).toBe('96px');
    view.rerender(<Button>Publish</Button>);
    expect(button.style.width).toBe('');
  });

  it('exposes pressed and busy state while preserving label and preventing loading actions', () => {
    let clicks = 0;
    const view = render(
      <Button loading pressed onClick={() => clicks++}>
        Publish
      </Button>,
    );
    const button = view.getByRole('button', { name: 'Publish' });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.dataset.state).toBe('loading');
    expect(button.querySelector('[data-slot=spinner]')).not.toBeNull();
    fireEvent.click(button);
    expect(clicks).toBe(0);
    view.rerender(
      <Button pressed={false} onClick={() => clicks++}>
        Publish
      </Button>,
    );
    expect(button.dataset.state).toBe('off');
    fireEvent.click(button);
    expect(clicks).toBe(1);
  });
  it('composes a loading child without nesting interactive elements', () => {
    let clicks = 0;
    const view = render(
      <Button asChild loading>
        <a href="/publish" onClick={() => clicks++}>
          Publish
        </a>
      </Button>,
    );
    const link = view.getByRole('link');
    expect(link.getAttribute('aria-busy')).toBe('true');
    expect(link.querySelector('[data-slot=spinner]')).not.toBeNull();
    fireEvent.click(link);
    expect(clicks).toBe(0);
  });
});
function Group({
  orientation = 'horizontal',
  loop = true,
  dir = 'ltr',
}: {
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  dir?: 'ltr' | 'rtl';
}) {
  const { ref, onKeyDown, onFocusCapture } = useRovingFocus({
    orientation,
    loop,
    dir,
  });
  return (
    <div ref={ref} onKeyDown={onKeyDown} onFocusCapture={onFocusCapture}>
      <button>A</button>
      <button disabled>B</button>
      <button>C</button>
    </div>
  );
}
describe('useRovingFocus', () => {
  it('has one tab stop, skips disabled items, loops, and supports Home/End', () => {
    const view = render(<Group />);
    const a = view.getByText('A'),
      c = view.getByText('C');
    expect(a.tabIndex).toBe(0);
    expect(c.tabIndex).toBe(-1);
    act(() => a.focus());
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(c);
    expect(a.tabIndex).toBe(-1);
    fireEvent.keyDown(c, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(a, { key: 'End' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(c, { key: 'Home' });
    expect(document.activeElement).toBe(a);
  });
  it('supports vertical orientation and non-looping endpoints', () => {
    const view = render(<Group orientation="vertical" loop={false} />);
    const a = view.getByText('A'),
      c = view.getByText('C');
    act(() => a.focus());
    fireEvent.keyDown(a, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(a);
    fireEvent.keyDown(a, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(c);
    fireEvent.keyDown(c, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(c);
  });
  it('reverses horizontal arrows for RTL', () => {
    const view = render(<Group dir="rtl" loop={false} />);
    const a = view.getByText('A');
    act(() => a.focus());
    fireEvent.keyDown(a, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(view.getByText('C'));
  });
});
describe('Toolbar', () => {
  it('wires keyboard navigation and orientation', () => {
    const view = render(
      <Toolbar aria-label="Editor">
        <ToolbarButton>Open</ToolbarButton>
        <ToolbarButton disabled>Save</ToolbarButton>
        <ToolbarButton>Close</ToolbarButton>
      </Toolbar>,
    );
    expect(view.getByRole('toolbar').getAttribute('aria-orientation')).toBe(
      'horizontal',
    );
    const open = view.getByText('Open').closest('button')!;
    act(() => open.focus());
    fireEvent.keyDown(open, { key: 'End' });
    expect(document.activeElement).toBe(
      view.getByText('Close').closest('button'),
    );
  });
});
describe('shared utilities', () => {
  it('updates uncontrolled values and reports controlled changes without mutating the value', () => {
    const changed: number[] = [];
    const hook = renderHook(
      ({ value }: { value?: number }) =>
        useControllableState({
          value,
          defaultValue: 1,
          onChange: (n) => changed.push(n),
        }),
      { initialProps: { value: undefined } as { value?: number } },
    );
    act(() => hook.result.current[1]((n) => n + 1));
    expect(hook.result.current[0]).toBe(2);
    hook.rerender({ value: 10 });
    act(() => hook.result.current[1](11));
    expect(hook.result.current[0]).toBe(10);
    expect(changed).toEqual([2, 11]);
  });
  it('cleans up callback and object refs', () => {
    const obj = { current: null as HTMLElement | null };
    let disposed = false;
    const ref = composeRefs(obj, () => () => {
      disposed = true;
    });
    const element = document.createElement('div');
    const cleanup = ref(element);
    expect(obj.current).toBe(element);
    if (typeof cleanup === 'function') cleanup();
    expect(obj.current).toBeNull();
    expect(disposed).toBe(true);
  });
});
