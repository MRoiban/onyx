import * as React from 'react';
import { describe, it, expect } from 'bun:test';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Checkbox } from '../src/components/checkbox';
import { Field, Label } from '../src/components/field';
import { Slider } from '../src/components/slider';
import { OTPField, useOTPField } from '../src/components/otp-field';
import { useNumberField } from '../src/components/number-field';
import { useCalendar } from '../src/components/calendar';
import { useColorPicker } from '../src/components/color-picker';
import { useResettableState } from '../src/lib/use-form-reset';

describe('Forms round 2', () => {
  it('R1 repeated rejected controlled Checkbox clicks retain React tracking', () => {
    const changes: boolean[] = [];
    render(<Checkbox checked={false} onChange={e => changes.push(e.target.checked)} />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    for (let i = 0; i < 2; i++) {
      fireEvent.click(input);
      expect(input.checked).toBe(false);
      expect(input.dataset.state).toBe('unchecked');
    }
    expect(changes).toEqual([true, true]);
  });
  it('R1 Checkbox effects synchronize mixed state without native descriptor overrides', () => {
    const { rerender } = render(<Checkbox checked={false} aria-checked="mixed" onChange={() => {}} />);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
    expect(input.dataset.state).toBe('indeterminate');
    expect(Object.hasOwn(input, 'indeterminate')).toBe(false);
    rerender(<Checkbox checked aria-checked={true} onChange={() => {}} />);
    expect(input.indeterminate).toBe(false);
    expect(input.dataset.state).toBe('checked');
  });
  it('R4 range thumbs compose Field and per-thumb names', () => {
    render(<Field><Label>Budget</Label><Slider defaultValue={[20, 80]} thumbLabels={['Minimum', 'Maximum']} /></Field>);
    expect(screen.getByRole('slider', { name: 'Budget Minimum' })).toBeTruthy();
    expect(screen.getByRole('slider', { name: 'Budget Maximum' })).toBeTruthy();
  });
  it('R5 OTP Field label uniquely targets its first cell', () => {
    const { container } = render(<Field><Label>Code</Label><OTPField length={2} /></Field>);
    const label = container.querySelector('label')!;
    const first = screen.getByRole('textbox', { name: 'Code digit 1 of 2' });
    expect(label.control).toBe(first);
    expect(container.querySelectorAll(`[id="${first.id}"]`).length).toBe(1);
    label.control!.focus();
    expect(document.activeElement).toBe(first);
  });
  it('R7 controlled ColorPicker rejects HSV changes and preserves equivalent latent coordinates', () => {
    let state!: ReturnType<typeof useColorPicker>;
    const changes: string[] = [];
    function Custom({ value }: { value: string }) { state = useColorPicker({ value, onValueChange: v => changes.push(v) }); return <section><button onClick={() => state.update({ h: 120 })}>Hue</button><output>{state.hsv.h}</output></section>; }
    const { rerender } = render(<Custom value="#ff0000" />);
    fireEvent.click(screen.getByText('Hue'));
    expect(changes).toEqual(['#00FF00']);
    expect(state.hsv.h).toBe(0);
    rerender(<Custom value="#000000" />);
    act(() => state.update({ h: 120, s: .8 }));
    expect(state.hsv.h).toBe(120);
    expect(state.hsv.s).toBe(.8);
    rerender(<Custom value="#000000" />);
    expect(state.hsv.h).toBe(120);
    rerender(<Custom value="#808080" />);
    act(() => state.update({ h: 240 }));
    expect(state.hsv.h).toBe(240);
    rerender(<Custom value="#ff0000" />);
    expect(state.hsv.h).toBe(0);
  });
  it('R8 resettable state resets silently and retains functional updates and controlled authority', () => {
    let state!: ReturnType<typeof useResettableState<number>>;
    const changes: number[] = [];
    function Custom({ value }: { value?: number }) { state = useResettableState({ value, defaultValue: 2, onChange: v => changes.push(v) }); return <output>{state[0]}</output>; }
    const { rerender } = render(<Custom />);
    act(() => { state[1](v => v + 1); state[1](v => v + 1); });
    expect(state[0]).toBe(4);
    act(() => state[2]());
    expect(state[0]).toBe(2);
    expect(changes).toEqual([3, 4]);
    rerender(<Custom value={9} />);
    act(() => { state[1](10); state[2](); });
    expect(state[0]).toBe(9);
    expect(changes).toEqual([3, 4, 10]);
  });
  it('R9 useNumberField supports typing and stepping in a custom root', () => {
    function Custom() { const s = useNumberField({ defaultValue: 2 }); return <section><input aria-label="Custom number" {...s.inputProps} /><button onClick={s.increment}>Step</button></section>; }
    render(<Custom />);
    const input = screen.getByLabelText('Custom number') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '8' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('Step'));
    expect(input.value).toBe('9');
  });
  it('R9 useOTPField supports paste, focus navigation and deletion in a custom root', () => {
    function Custom() { const s = useOTPField({ length: 2 }); return <section>{[0, 1].map(i => <input key={i} ref={n => { s.inputs.current[i] = n; }} {...s.getCellProps(i)} />)}</section>; }
    render(<Custom />);
    const first = screen.getByLabelText('Digit 1 of 2') as HTMLInputElement;
    const second = screen.getByLabelText('Digit 2 of 2') as HTMLInputElement;
    fireEvent.paste(first, { clipboardData: { getData: () => '12' } });
    expect(first.value + second.value).toBe('12');
    expect(document.activeElement).toBe(second);
    fireEvent.keyDown(second, { key: 'Backspace' });
    expect(second.value).toBe('');
    fireEvent.keyDown(second, { key: 'Home' });
    expect(document.activeElement).toBe(first);
  });
  it('R9 useCalendar supports keyboard selection in a custom root', () => {
    function Custom() { const s = useCalendar({ defaultMonth: new Date(2026, 0, 1) }); return <section><button onKeyDown={e => s.onKeyDown(e)}>Day</button><output>{s.value instanceof Date ? s.value.getDate() : ''}</output></section>; }
    render(<Custom />);
    fireEvent.keyDown(screen.getByText('Day'), { key: 'ArrowRight' });
    fireEvent.keyDown(screen.getByText('Day'), { key: 'Enter' });
    expect(screen.getByText('2')).toBeTruthy();
  });
  it('R9 useColorPicker supports custom root interaction', () => {
    function Custom() { const s = useColorPicker({ defaultValue: '#ff0000' }); return <section><button onClick={() => s.update({ h: 120 })}>Green</button><output>{s.value}</output></section>; }
    render(<Custom />);
    fireEvent.click(screen.getByText('Green'));
    expect(screen.getByText('#00FF00')).toBeTruthy();
  });
});
