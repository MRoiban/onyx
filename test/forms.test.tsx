import { describe, it, expect } from 'bun:test';
import { render, fireEvent, screen, act } from '@testing-library/react';
import { Field, Label, FieldDescription, FieldError } from '../src/field';
import { Input } from '../src/input';
import { NumberField } from '../src/number-field';
import { Calendar, getWeekStartsOn } from '../src/calendar';
import { OTPField } from '../src/otp-field';
import { ColorPicker } from '../src/color-picker';
import { ColorSwatch, ColorSwatchGroup } from '../src/color-swatch';
import { DropZone, acceptsFile } from '../src/drop-zone';
import { ToggleGroup, ToggleGroupItem } from '../src/toggle-group';
import {
  CheckboxGroup,
  CheckboxGroupItem,
  CheckboxGroupSelectAll,
} from '../src/checkbox-group';
import {
  hexToRgb,
  rgbToHex,
  hsvToRgb,
  rgbToHsv,
  hexToHsv,
  hsvToHex,
} from '../src/lib/color';

describe('W2 forms', () => {
  it('links label, description and live error; propagates required and disabled', () => {
    const { rerender } = render(
      <Field required disabled invalid>
        <Label>Name</Label>
        <Input />
        <FieldDescription>Choose a name</FieldDescription>
        <FieldError>Already used</FieldError>
      </Field>,
    );
    const input = screen.getByRole('textbox', {
      name: 'Name',
    }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.getAttribute('aria-required')).toBe('true');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const ids = input.getAttribute('aria-describedby')!.split(' ');
    expect(ids.length).toBe(2);
    expect(ids.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Choose a name',
      'Already used',
    ]);
    expect(screen.getByText('Already used').getAttribute('aria-live')).toBe(
      'polite',
    );
    rerender(
      <Field>
        <Label>Name</Label>
        <Input />
        <FieldDescription>Choose a name</FieldDescription>
      </Field>,
    );
    expect(screen.getByLabelText('Name').getAttribute('aria-invalid')).toBe(
      null,
    );
    expect(
      screen.getByLabelText('Name').getAttribute('aria-describedby')?.split(' ')
        .length,
    ).toBe(1);
  });
  it('keeps explicit input attributes authoritative', () => {
    render(
      <Field disabled invalid>
        <Input
          id="custom"
          aria-label="Custom"
          disabled={false}
          aria-invalid={false}
          aria-describedby="external"
        />
      </Field>,
    );
    const input = screen.getByLabelText('Custom') as HTMLInputElement;
    expect(input.id).toBe('custom');
    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-describedby')).toBe('external');
  });
  it('steps, clamps, jumps and submits a raw number', () => {
    const { container } = render(
      <NumberField defaultValue={3} min={1} max={11} step={2} name="count" />,
    );
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.value).toBe('5');
    fireEvent.keyDown(input, { key: 'PageUp' });
    expect(input.value).toBe('11');
    fireEvent.keyDown(input, { key: 'Home' });
    expect(input.value).toBe('1');
    fireEvent.keyDown(input, { key: 'End' });
    expect(input.value).toBe('11');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.value).toBe('9');
    fireEvent.change(input, { target: { value: '999' } });
    fireEvent.blur(input);
    expect(input.value).toBe('11');
    expect(input.getAttribute('aria-valuemax')).toBe('11');
    expect(
      container.querySelector<HTMLInputElement>('input[type=hidden]')!.value,
    ).toBe('11');
  });
  it('parses locale digits, decimals, currencies and percentages', () => {
    const { rerender } = render(
      <NumberField defaultValue={1234.5} step={0.1} locale="de-DE" />,
    );
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('1.234,5');
    fireEvent.change(input, { target: { value: '2.345,6' } });
    fireEvent.blur(input);
    expect(input.getAttribute('aria-valuenow')).toBe('2345.6');
    rerender(
      <NumberField
        value={0.25}
        step={0.01}
        locale="en-US"
        formatOptions={{ style: 'percent' }}
      />,
    );
    expect(input.value).toBe('25%');
    rerender(<NumberField value={12.5} locale="ar-EG" />);
    expect(input.value).toContain('١٢');
  });
  it('does not wheel by default, and supports opt-in while focused', () => {
    const { rerender } = render(<NumberField defaultValue={2} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    input.focus();
    fireEvent.wheel(input, { deltaY: -1 });
    expect(input.value).toBe('2');
    rerender(<NumberField defaultValue={2} wheel />);
    fireEvent.wheel(input, { deltaY: -1 });
    expect(input.value).toBe('3');
  });
  it('uses locale week starts and navigates the date grid with one tab stop', () => {
    expect(getWeekStartsOn('en-US')).toBe(0);
    expect(getWeekStartsOn('en-GB')).toBe(1);
    const { container } = render(
      <Calendar defaultMonth={new Date(2026, 9, 1)} locale="en-GB" />,
    );
    expect(screen.getAllByRole('columnheader')[0].textContent).toBe('Mo');
    const oct1 = screen.getByRole('button', {
      name: 'Thursday, 1 October 2026',
    });
    act(() => oct1.focus());
    fireEvent.keyDown(oct1, { key: 'ArrowRight' });
    expect(document.activeElement?.textContent).toBe('2');
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(document.activeElement?.textContent).toBe('4');
    fireEvent.keyDown(document.activeElement!, { key: 'PageDown' });
    expect(document.activeElement?.getAttribute('aria-label')).toContain(
      '4 November 2026',
    );
    expect(
      container.querySelectorAll('[data-slot="calendar-day"][tabindex="0"]')
        .length,
    ).toBe(1);
  });
  it('selects a reversed date range and prevents ranges through disabled days', () => {
    const changed: unknown[] = [];
    const { rerender } = render(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 9, 1)}
        locale="en-GB"
        onValueChange={(v) => changed.push(v)}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Saturday, 10 October 2026' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Tuesday, 6 October 2026' }),
    );
    expect(changed[1]).toEqual({
      from: new Date(2026, 9, 6),
      to: new Date(2026, 9, 10),
    });
    expect(
      screen
        .getAllByRole('gridcell')
        .filter((el) => el.getAttribute('aria-selected') === 'true').length,
    ).toBe(5);
    rerender(
      <Calendar
        mode="range"
        defaultMonth={new Date(2026, 9, 1)}
        locale="en-GB"
        disabled={(d) => d.getDate() === 8}
        onValueChange={(v) => changed.push(v)}
      />,
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'Tuesday, 6 October 2026' }),
    );
    const before = changed.length;
    fireEvent.click(
      screen.getByRole('button', { name: 'Saturday, 10 October 2026' }),
    );
    expect(changed.length).toBe(before);
  });
  it('clamps date navigation to min/max and handles leap month paging', () => {
    render(
      <Calendar
        defaultValue={new Date(2024, 0, 31)}
        locale="en-GB"
        min={new Date(2024, 0, 30)}
        max={new Date(2024, 2, 1)}
      />,
    );
    const date = screen.getByRole('button', {
      name: 'Wednesday, 31 January 2024',
    });
    act(() => date.focus());
    fireEvent.keyDown(date, { key: 'PageDown' });
    expect(document.activeElement?.getAttribute('aria-label')).toContain(
      '29 February 2024',
    );
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(document.activeElement?.getAttribute('aria-label')).toContain(
      '1 March 2024',
    );
  });
  it('distributes OTP paste, advances, and clears backwards', () => {
    const { container } = render(<OTPField defaultValue="481" name="otp" />);
    const cells = screen.getAllByRole('textbox') as HTMLInputElement[];
    fireEvent.paste(cells[3], { clipboardData: { getData: () => '2 3x4' } });
    expect(cells.map((c) => c.value).join('')).toBe('481234');
    expect(document.activeElement).toBe(cells[5]);
    fireEvent.keyDown(cells[5], { key: 'Backspace' });
    expect(cells[5].value).toBe('');
    fireEvent.keyDown(cells[5], { key: 'Backspace' });
    expect(cells[4].value).toBe('');
    expect(document.activeElement).toBe(cells[4]);
    expect(
      container.querySelector<HTMLInputElement>('input[type=hidden]')?.value,
    ).toBe('4812');
    expect(cells[0].autocomplete).toBe('one-time-code');
  });
  it('does not complete an OTP with missing earlier cells', () => {
    const completed: string[] = [];
    render(<OTPField onComplete={(code) => completed.push(code)} />);
    fireEvent.change(screen.getAllByRole('textbox')[5], {
      target: { value: '2' },
    });
    expect(completed).toEqual([]);
  });
  it('round-trips RGB, HSV and hex including alpha', () => {
    for (const hex of [
      '#205EA6',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#000000',
      '#FFFFFF',
      '#CE5D9780',
    ]) {
      const rgb = hexToRgb(hex)!;
      expect(rgbToHex(hsvToRgb(rgbToHsv(rgb)))).toBe(hex);
      expect(hsvToHex(hexToHsv(hex)!)).toBe(hex);
    }
    expect(hexToRgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    expect(hexToRgb('invalid')).toBe(null);
    expect(hexToRgb('#12345')).toBe(null);
  });
  it('operates color area with native keyboard range controls', () => {
    render(<ColorPicker defaultValue="#FF0000" />);
    const saturation = screen.getByRole('slider', { name: 'Saturation' });
    fireEvent.change(saturation, { target: { value: '50' } });
    expect((screen.getByLabelText('Hex color') as HTMLInputElement).value).toBe(
      '#FF8080',
    );
  });
  it('roves and selects swatches', () => {
    render(
      <ColorSwatchGroup defaultValue="red" aria-label="Colors">
        <ColorSwatch color="red" />
        <ColorSwatch color="blue" />
      </ColorSwatchGroup>,
    );
    const red = screen.getByRole('radio', { name: 'red' });
    act(() => red.focus());
    fireEvent.keyDown(red, { key: 'ArrowRight' });
    expect(
      screen.getByRole('radio', { name: 'blue' }).getAttribute('aria-checked'),
    ).toBe('true');
  });
  it('validates extensions, MIME wildcards, size and drop acceptance', () => {
    expect(acceptsFile({ name: 'DATA.JSON', type: '' }, '.zip,.json')).toBe(
      true,
    );
    expect(acceptsFile({ name: 'a.png', type: 'image/png' }, 'image/*')).toBe(
      true,
    );
    expect(
      acceptsFile(
        { name: 'a.exe', type: 'application/x-msdownload' },
        '.zip,.json',
      ),
    ).toBe(false);
    const accepted: File[][] = [],
      rejected: File[][] = [];
    render(
      <DropZone
        accept=".json"
        maxSize={5}
        onFiles={(v) => accepted.push(v)}
        onReject={(v) => rejected.push(v)}
      >
        Drop files
      </DropZone>,
    );
    const zone = screen.getByRole('button', { name: 'Drop files' });
    const json = new File(['{}'], 'a.json', { type: 'application/json' });
    fireEvent.drop(zone, { dataTransfer: { files: [json] } });
    expect(accepted[0]).toEqual([json]);
    const bad = new File(['bad'], 'a.exe');
    fireEvent.drop(zone, { dataTransfer: { files: [bad] } });
    expect(rejected[0]).toEqual([bad]);
    expect(zone.hasAttribute('data-invalid')).toBe(true);
    expect(accepted.length).toBe(1);
  });
  it('supports select-all mixed state and native group submission', () => {
    const { container } = render(
      <CheckboxGroup defaultValue={['a']} name="locale">
        <CheckboxGroupSelectAll aria-label="All" />
        <CheckboxGroupItem value="a" aria-label="A" />
        <CheckboxGroupItem value="b" aria-label="B" />
      </CheckboxGroup>,
    );
    const all = screen.getByLabelText('All') as HTMLInputElement;
    expect(all.indeterminate).toBe(true);
    fireEvent.click(all);
    expect((screen.getByLabelText('B') as HTMLInputElement).checked).toBe(true);
    expect(all.indeterminate).toBe(false);
    expect(
      container.querySelectorAll('input[name=locale]:checked').length,
    ).toBe(2);
  });
  it('supports single and multiple toggle groups with form values', () => {
    const { container, unmount } = render(
      <ToggleGroup type="single" defaultValue="a" name="view">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('B').getAttribute('data-state')).toBe('on');
    expect(screen.getByText('A').getAttribute('data-state')).toBe('off');
    expect(
      container.querySelector<HTMLInputElement>('input[type=hidden]')?.value,
    ).toBe('b');
    unmount();
    render(
      <ToggleGroup type="multiple" defaultValue={['a']}>
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    fireEvent.click(screen.getByText('B'));
    expect(screen.getByText('A').getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('B').getAttribute('aria-pressed')).toBe('true');
  });
});
