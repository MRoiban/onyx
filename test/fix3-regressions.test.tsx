import * as React from 'react';
import { describe, expect, it } from 'bun:test';
import { act, fireEvent, render } from '@testing-library/react';
import { ColorPicker } from '../src/components/color-picker';
import { isFocusableCandidate } from '../src/lib/use-roving-focus';
import { useRemovalFocus } from '../src/lib/use-removal-focus';

describe('Final review regressions', () => {
  for (const external of [false, true]) {
    it(`ColorPicker resets an invalid draft even when the committed color is unchanged (${external ? 'external' : 'ancestor'} form)`, async () => {
      const picker = <ColorPicker defaultValue="#ff0000" name="color" form={external ? 'color-form' : undefined} />;
      const view = render(external ? <><form id="color-form" />{picker}</> : <form>{picker}</form>);
      const input = view.getByRole('textbox') as HTMLInputElement;
      fireEvent.change(input, { target: { value: '#zz' } });
      expect(input.getAttribute('aria-invalid')).toBe('true');
      await act(async () => { view.container.querySelector('form')!.reset(); await Promise.resolve(); });
      expect(input.value).toBe('#ff0000');
      expect(input.hasAttribute('aria-invalid')).toBe(false);
      expect(new FormData(view.container.querySelector('form')!).get('color')).toBe('#ff0000');
    });
  }

  it('ColorPicker preserves a draft on cancelled reset and restores the controlled color on accepted reset', async () => {
    const view = render(<form onReset={e => e.preventDefault()}><ColorPicker value="#00ff00" name="color" /></form>);
    const input = view.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '#zz' } });
    const reset = async () => { await act(async () => { view.container.querySelector('form')!.reset(); await Promise.resolve(); }); };
    await reset();
    expect(input.value).toBe('#zz');
    view.rerender(<form><ColorPicker value="#00ff00" name="color" /></form>);
    await reset();
    expect(input.value).toBe('#00ff00');
    expect(new FormData(view.container.querySelector('form')!).get('color')).toBe('#00ff00');
  });

  it('focus recovery reaches visible descendants of visibility-hidden ancestors', () => {
    function Harness({ removed = false }: { removed?: boolean }) {
      const ref = React.useRef<HTMLDivElement>(null);
      const fallbackRef = React.useRef<HTMLButtonElement>(null);
      const { captureFocus } = useRemovalFocus(ref, '[data-item]', { fallbackRef });
      return <><button ref={fallbackRef}>Fallback</button><div ref={ref} onFocusCapture={captureFocus}>
        {!removed && <div data-item><button>Remove me</button></div>}
        <div data-item style={{ visibility: 'hidden' }}><button>Hidden</button><button style={{ visibility: 'visible' }}>Visible child</button></div>
        <div data-item style={{ display: 'none' }}><button style={{ visibility: 'visible' }}>Display hidden</button></div>
      </div></>;
    }
    const view = render(<Harness />);
    expect(isFocusableCandidate(view.getByText('Visible child'))).toBe(true);
    expect(isFocusableCandidate(view.getByText('Hidden'))).toBe(false);
    expect(isFocusableCandidate(view.getByText('Display hidden'))).toBe(false);
    act(() => view.getByText('Remove me').focus());
    view.rerender(<Harness removed />);
    expect(document.activeElement).toBe(view.getByText('Visible child'));
  });
});
