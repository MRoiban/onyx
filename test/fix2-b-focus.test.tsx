import { describe, expect, it } from 'bun:test';
import { act, render } from '@testing-library/react';
import { useRef } from 'react';
import { isFocusableCandidate } from '../src/lib/use-roving-focus';
import { useRemovalFocus } from '../src/lib/use-removal-focus';

function Harness({ removed = false, hidden = false, fallback = false, onEmpty }: { removed?: boolean; hidden?: boolean; fallback?: boolean; onEmpty?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLButtonElement>(null);
  const { captureFocus } = useRemovalFocus(ref, '[data-item]', { fallbackRef: fallback ? fallbackRef : undefined, onEmpty });
  return <><button ref={fallbackRef}>Fallback</button><div ref={ref} onFocusCapture={captureFocus} data-testid="root">
    {!removed && <div data-item><button data-slot="remove">Removed</button></div>}
    <div data-item style={hidden ? { display: 'none' } : undefined}><input type="hidden" /><button data-slot="remove">Next</button></div>
    <div data-item><button data-slot="remove">Last</button></div>
  </div></>;
}

describe('fix2 B removal focus', () => {
  it('shares candidate eligibility for disconnected, CSS-hidden and inaccessible controls', () => {
    const view = render(<div><input type="hidden" /><button hidden>Hidden</button><div style={{ display: 'none' }}><button>Display</button></div><div style={{ visibility: 'hidden' }}><button>Visibility</button></div><button disabled>Disabled</button><div inert><button>Inert</button></div><div aria-hidden="true"><button>Aria</button></div><button>Visible</button></div>);
    for (const candidate of view.container.querySelectorAll<HTMLElement>('button,input')) {
      expect(isFocusableCandidate(candidate)).toBe(candidate.textContent === 'Visible');
    }
    expect(isFocusableCandidate(document.createElement('button'))).toBe(false);
  });
  it('skips CSS-hidden neighbours and hidden inputs', () => {
    const view = render(<Harness hidden />);
    act(() => view.getByText('Removed').focus());
    view.rerender(<Harness removed hidden />);
    expect(document.activeElement).toBe(view.getByText('Last'));
  });
  it('falls through a silently failed focus to the next neighbour', () => {
    const view = render(<Harness />);
    view.getByText('Next').focus = () => {};
    act(() => view.getByText('Removed').focus());
    view.rerender(<Harness removed />);
    expect(document.activeElement).toBe(view.getByText('Last'));
  });
  it('runs onEmpty and fallback when every neighbour fails focus', () => {
    let empty = 0;
    const onEmpty = () => empty++;
    const view = render(<Harness fallback onEmpty={onEmpty} />);
    view.getByText('Next').focus = () => {};
    view.getByText('Last').focus = () => {};
    act(() => view.getByText('Removed').focus());
    view.rerender(<Harness removed fallback onEmpty={onEmpty} />);
    expect(empty).toBe(1);
    expect(document.activeElement).toBe(view.getByText('Fallback'));
  });
});
