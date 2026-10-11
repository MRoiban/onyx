import * as React from 'react';
import { describe, it, expect } from 'bun:test';
import { render, fireEvent, screen, act, cleanup } from '@testing-library/react';
import { Field, Label, FieldDescription } from '../src/components/field';
import { InputGroup, InputGroupInput } from '../src/components/input-group';
import { Input } from '../src/components/input';
import { Textarea } from '../src/components/textarea';
import { Checkbox } from '../src/components/checkbox';
import { Switch } from '../src/components/switch';
import { Select, SelectTrigger, SelectValue } from '../src/components/select';
import { NumberField } from '../src/components/number-field';
import { SearchField } from '../src/components/search-field';
import { OTPField } from '../src/components/otp-field';
import { Slider } from '../src/components/slider';
import { RadioGroup, RadioGroupItem } from '../src/components/radio-group';
import { CheckboxGroup, CheckboxGroupItem } from '../src/components/checkbox-group';
import { Toggle } from '../src/components/toggle';
import { ToggleGroup, ToggleGroupItem } from '../src/components/toggle-group';
import { ColorPicker } from '../src/components/color-picker';
import { ColorSwatchGroup, ColorSwatch } from '../src/components/color-swatch';
import { PasswordField } from '../src/components/password-field';
import { SliderTrack, SliderThumb } from '../src/components/slider';
import { Calendar } from '../src/components/calendar';

describe('forms fix round D', () => {
  const controls = [
    ['Input', (disabled?: boolean) => <Input disabled={disabled} />, 'textbox'],
    ['Textarea', (disabled?: boolean) => <Textarea disabled={disabled} />, 'textbox'],
    ['Checkbox', (disabled?: boolean) => <Checkbox disabled={disabled} />, 'checkbox'],
    ['Switch', (disabled?: boolean) => <Switch disabled={disabled} />, 'switch'],
    ['Select trigger', (disabled?: boolean) => <Select><SelectTrigger disabled={disabled}><SelectValue /></SelectTrigger></Select>, 'combobox'],
    ['NumberField', (disabled?: boolean) => <NumberField disabled={disabled} />, 'spinbutton'],
    ['PasswordField', (disabled?: boolean) => <PasswordField disabled={disabled} />, 'textbox'],
    ['Toggle', (disabled?: boolean) => <Toggle disabled={disabled} />, 'button'],
    ['SearchField', (disabled?: boolean) => <SearchField disabled={disabled} />, 'searchbox'],
  ] as const;
  for (const [name, control, role] of controls) {
    it(`${name}: explicit disabled prop wins over Field`, () => {
      const { rerender } = render(<Field disabled><Label>Control</Label>{control(false)}</Field>);
      expect(((name === 'PasswordField' ? screen.getByLabelText('Control') : screen.getByRole(role, { name: 'Control' })) as HTMLInputElement).disabled).toBe(false);
      rerender(<Field><Label>Control</Label>{control(true)}</Field>);
      expect(((name === 'PasswordField' ? screen.getByLabelText('Control') : screen.getByRole(role, { name: 'Control' })) as HTMLInputElement).disabled).toBe(true);
      rerender(<Field disabled><Label>Control</Label>{control()}</Field>);
      expect(((name === 'PasswordField' ? screen.getByLabelText('Control') : screen.getByRole(role, { name: 'Control' })) as HTMLInputElement).disabled).toBe(true);
    });
  }
  it('InputGroup explicit disabled and invalid props win over Field', () => {
    const { container, rerender } = render(<Field disabled invalid><InputGroup disabled={false} invalid={false}><InputGroupInput disabled={false} aria-invalid={false} /></InputGroup></Field>);
    const group = container.querySelector('[data-slot="input-group"]')!;
    expect(group.hasAttribute('data-disabled')).toBe(false);
    expect(group.hasAttribute('data-invalid')).toBe(false);
    rerender(<Field disabled invalid><InputGroup><InputGroupInput /></InputGroup></Field>);
    expect(group.hasAttribute('data-disabled')).toBe(true);
    expect(group.hasAttribute('data-invalid')).toBe(true);
  });
  it('RadioGroup and Slider expose invalid state hooks', () => {
    const { container } = render(<Field invalid><RadioGroup /><Slider /></Field>);
    expect(container.querySelector('[data-slot="radio-group"]')?.hasAttribute('data-invalid')).toBe(true);
    expect(container.querySelector('[data-slot="slider"]')?.hasAttribute('data-invalid')).toBe(true);
  });
  it('all compound Field controls honor explicit disabled false and inherit omitted disabled', () => {
    const examples = [
      [<OTPField disabled={false} />, <OTPField />, '[data-slot="otp-field-cell"]'],
      [<Slider disabled={false} />, <Slider />, '[data-slot="slider"]'],
      [<RadioGroup disabled={false}><RadioGroupItem value="a">A</RadioGroupItem></RadioGroup>, <RadioGroup><RadioGroupItem value="a">A</RadioGroupItem></RadioGroup>, '[data-slot="radio-group-item"]'],
      [<CheckboxGroup disabled={false}><CheckboxGroupItem value="a" /></CheckboxGroup>, <CheckboxGroup><CheckboxGroupItem value="a" /></CheckboxGroup>, '[data-slot="checkbox-group-item"]'],
      [<ToggleGroup type="single" disabled={false}><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>, <ToggleGroup type="single"><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>, '[data-slot="toggle-group-item"]'],
      [<ColorPicker disabled={false} />, <ColorPicker />, '[data-slot="color-picker-saturation"]'],
      [<ColorSwatchGroup disabled={false}><ColorSwatch color="#ff0000" /></ColorSwatchGroup>, <ColorSwatchGroup><ColorSwatch color="#ff0000" /></ColorSwatchGroup>, '[data-slot="color-swatch"]'],
      [<Calendar disabled={false} />, <Calendar />, '[data-slot="calendar-next"]'],
    ] as const;
    for (const [enabled, inherited, selector] of examples) {
      const { container, rerender } = render(<Field disabled>{enabled}</Field>);
      expect(container.querySelector(selector)?.hasAttribute('data-disabled') ?? false).toBe(false);
      expect((container.querySelector(selector) as HTMLInputElement).disabled ?? false).toBe(false);
      rerender(<Field disabled>{inherited}</Field>);
      const target = container.querySelector(selector) as HTMLInputElement;
      expect(target.disabled || target.hasAttribute('data-disabled')).toBe(true);
      cleanup();
    }
  });
  it('composed SliderThumb inherits root naming and ARIA', () => {
    render(<Field invalid><Label>Custom level</Label><Slider aria-describedby="help"><SliderTrack /><SliderThumb /></Slider></Field>);
    const thumb = screen.getByRole('slider', { name: 'Custom level' });
    expect(thumb.getAttribute('aria-describedby')).toBe('help');
    expect(thumb.getAttribute('aria-invalid')).toBe('true');
  });
  it('ColorPicker names editable parts with the Field label', () => {
    render(<Field invalid required><Label>Accent</Label><ColorPicker /></Field>);
    for (const part of ['Saturation', 'Brightness', 'Hue']) {
      const target = screen.getByRole('slider', { name: `Accent ${part}` });
      expect(target.getAttribute('aria-invalid')).toBe('true');
      expect(target.getAttribute('aria-required')).toBe('true');
    }
    expect(screen.getByRole('textbox', { name: 'Accent Hex color' })).toBeTruthy();
  });
  it('Calendar and PasswordField reset their initial uncontrolled state', async () => {
    const { container } = render(<form><Calendar defaultValue={new Date(2026, 0, 15)} /><PasswordField defaultValue="secret" /></form>);
    fireEvent.click(screen.getByRole('button', { name: 'Wednesday, December 31, 2025' }));
    fireEvent.click(screen.getByLabelText('Show password'));
    await act(async () => { container.querySelector('form')!.reset(); await Promise.resolve(); });
    expect(screen.getByText('January 2026')).toBeTruthy();
    expect(screen.getByLabelText('Show password')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Thursday, January 15, 2026' }).dataset.state).toBe('selected');
  });
  it('Checkbox retains one input, root props and native state', () => {
    const ref = React.createRef<HTMLInputElement>();
    const { container, rerender } = render(<Checkbox ref={ref} hidden className="layout-marker" defaultChecked />);
    expect(container.children.length).toBe(1);
    expect(container.firstElementChild).toBe(ref.current);
    expect(ref.current!.hidden).toBe(true);
    expect(ref.current!.className).toContain('layout-marker');
    expect(ref.current!.dataset.state).toBe('checked');
    ref.current!.indeterminate = true;
    fireEvent.change(ref.current!);
    rerender(<Checkbox ref={ref} defaultChecked className="layout-marker" />);
    expect(ref.current!.dataset.state).toBe('indeterminate');
    ref.current!.indeterminate = false;
    fireEvent.click(ref.current!);
    expect(ref.current!.dataset.state).toBe('unchecked');
    ref.current!.checked = true;
    rerender(<Checkbox ref={ref} defaultChecked className="layout-marker" />);
    expect(ref.current!.dataset.state).toBe('checked');
  });
  it('compound controls inherit Field names, description and invalid state', () => {
    const examples = [
      [<Slider />, 'slider'],
      [<RadioGroup><RadioGroupItem value="a">A</RadioGroupItem></RadioGroup>, 'radiogroup'],
      [<CheckboxGroup><CheckboxGroupItem value="a" aria-label="A" /></CheckboxGroup>, 'group'],
      [<ToggleGroup type="single"><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>, 'radiogroup'],
      [<ColorPicker />, 'group'],
      [<Calendar defaultMonth={new Date(2026, 0, 1)} />, 'grid'],
    ] as const;
    for (const [control, role] of examples) {
      render(<Field invalid required><Label>Choice</Label>{control}<FieldDescription>Help</FieldDescription></Field>);
      const target = screen.getByRole(role, { name: 'Choice' });
      expect(target.getAttribute('aria-invalid')).toBe('true');
      expect(target.getAttribute('aria-required')).toBe('true');
      expect(document.getElementById(target.getAttribute('aria-describedby')!)?.textContent).toBe('Help');
      cleanup();
    }
  });
  it('Slider forwards explicit naming and state overrides to its thumbs', () => {
    render(<><span id="custom-name">Custom</span><Field invalid required><Label>Inherited</Label><Slider aria-labelledby="custom-name" aria-describedby="custom-description" aria-invalid={false} aria-required={false} /></Field></>);
    const thumb = screen.getByRole('slider', { name: 'Custom' });
    expect(thumb.getAttribute('aria-describedby')).toBe('custom-description');
    expect(thumb.getAttribute('aria-invalid')).toBe('false');
    expect(thumb.getAttribute('aria-required')).toBe('false');
    expect(document.querySelector('[data-slot="slider"]')?.hasAttribute('data-invalid')).toBe(false);
  });
  it('OTP names group and cells from Field or explicit aria-label', () => {
    const { rerender } = render(<Field><Label>Security code</Label><OTPField length={2} /></Field>);
    expect(screen.getByRole('group', { name: 'Security code' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Security code digit 1 of 2' })).toBeTruthy();
    rerender(<Field><Label>Security code</Label><OTPField length={2} aria-label="Verification" /></Field>);
    expect(screen.getByRole('group', { name: 'Verification' })).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Verification, digit 2 of 2' })).toBeTruthy();
  });
  it('OTP ignores IME input and navigation until composition ends', () => {
    const changes: string[] = [];
    render(<OTPField length={2} onValueChange={v => changes.push(v)} />);
    const first = screen.getByLabelText('Digit 1 of 2');
    first.focus();
    fireEvent.compositionStart(first);
    fireEvent.change(first, { target: { value: '1' } });
    fireEvent.keyDown(first, { key: 'ArrowRight', isComposing: true });
    expect(document.activeElement).toBe(first);
    expect(changes).toEqual([]);
    fireEvent.compositionEnd(first, { data: '1', target: { value: '1' } });
    expect(changes).toEqual(['1']);
    expect(document.activeElement).toBe(screen.getByLabelText('Digit 2 of 2'));
  });
  it('NumberField ARIA follows valid, empty and invalid drafts', () => {
    render(<NumberField defaultValue={2} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '3.5' } });
    expect(input.getAttribute('aria-valuenow')).toBe('3.5');
    expect(input.getAttribute('aria-valuetext')).toBe('3.5');
    fireEvent.change(input, { target: { value: '' } });
    expect(input.hasAttribute('aria-valuenow')).toBe(false);
    expect(input.getAttribute('aria-valuetext')).toBe('Empty');
    fireEvent.change(input, { target: { value: '-' } });
    expect(input.hasAttribute('aria-valuenow')).toBe(false);
    expect(input.getAttribute('aria-valuetext')).toBe('Invalid number: -');
  });
  it('NumberField restores controlled value after rejection and reassertion', () => {
    const props = { value: 2, onValueChange: (_: number) => {} };
    const { rerender } = render(<NumberField {...props} />);
    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.click(screen.getByLabelText('Increase value'));
    expect(input.value).toBe('2');
    fireEvent.change(input, { target: { value: '8' } });
    expect(input.value).toBe('8');
    rerender(<NumberField {...props} />);
    expect(input.value).toBe('2');
    fireEvent.change(input, { target: { value: '9' } });
    fireEvent.blur(input);
    expect(input.value).toBe('2');
  });
  for (const [locale, draft, expected, formatOptions] of [
    ['de-DE', '25,5%', .255, { style: 'percent' }],
    ['fr-FR', '1\u202f234,5', 1234.5, undefined],
    ['en-US', '1,234.5', 1234.5, undefined],
    ['de-DE', '-25,5%', -.255, { style: 'percent' }],
    ['en-US', '', 2, undefined],
  ] as const) {
    it(`NumberField parses ${locale} ${draft || 'empty'} correctly`, () => {
      render(<NumberField locale={locale} formatOptions={formatOptions} defaultValue={2} step={.001} name="number" />);
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: draft } });
      fireEvent.blur(input);
      expect(Number((document.querySelector('[data-slot="number-field-form-value"]') as HTMLInputElement).value)).toBe(expected);
    });
  }
  it('NumberField routes style, className and rootRef to root and inputRef/inputProps to input', () => {
    const root = React.createRef<HTMLDivElement>(); const input = React.createRef<HTMLInputElement>(); const legacy = React.createRef<HTMLInputElement>();
    render(<NumberField rootRef={root} inputRef={input} ref={legacy} className="root-marker" style={{ width: '50%' }} inputProps={{ className: 'input-marker', 'aria-label': 'Amount' }} aria-invalid="false" />);
    expect(root.current?.dataset.slot).toBe('number-field');
    expect(root.current?.style.width).toBe('50%');
    expect(root.current?.className).toContain('root-marker');
    expect(input.current).toBe(legacy.current);
    expect(screen.getByRole('spinbutton', { name: 'Amount' })).toBe(input.current!);
    expect(input.current?.className).toBe('input-marker');
    expect(root.current?.hasAttribute('data-invalid')).toBe(false);
  });
  for (const mode of ['readOnly', 'inherited disabled', 'explicit disabled'] as const) {
    it(`SearchField clear and Escape respect ${mode}`, () => {
      render(<Field disabled={mode === 'inherited disabled'}><SearchField defaultValue="term" readOnly={mode === 'readOnly'} disabled={mode === 'explicit disabled' ? true : undefined} /></Field>);
      const input = screen.getByRole('searchbox') as HTMLInputElement;
      fireEvent.click(screen.getByLabelText('Clear search'));
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(input.value).toBe('term');
    });
  }
  it('Calendar outside-day selection changes month and header navigation advances one month', () => {
    render(<Calendar defaultMonth={new Date(2026, 0, 1)} />);
    fireEvent.click(screen.getByRole('button', { name: 'Wednesday, December 31, 2025' }));
    expect(screen.getByText('December 2025')).toBeTruthy();
    fireEvent.click(screen.getByLabelText('Next month'));
    expect(screen.getByText('January 2026')).toBeTruthy();
  });
  it('ColorPicker preserves editable HSV at black and gray and accepts external hex changes', () => {
    const { rerender } = render(<ColorPicker defaultValue="#ff0000" />);
    fireEvent.change(screen.getByLabelText('Brightness'), { target: { value: '0' } });
    expect((screen.getByLabelText('Saturation') as HTMLInputElement).value).toBe('100');
    fireEvent.change(screen.getByLabelText('Brightness'), { target: { value: '100' } });
    expect((screen.getByLabelText('Hex color') as HTMLInputElement).value.toLowerCase()).toBe('#ff0000');
    fireEvent.change(screen.getByLabelText('Saturation'), { target: { value: '0' } });
    fireEvent.keyDown(screen.getByRole('slider', { name: 'Hue' }), { key: 'End' });
    fireEvent.change(screen.getByLabelText('Saturation'), { target: { value: '100' } });
    expect((screen.getByLabelText('Hex color') as HTMLInputElement).value.toLowerCase()).toBe('#ff0000');
    rerender(<ColorPicker value="#00ff00" />);
    expect(screen.getByRole('slider', { name: 'Hue' }).getAttribute('aria-valuenow')).toBe('120');
  });
  for (const external of [false, true]) {
    it(`native reset restores custom uncontrolled controls (${external ? 'external form' : 'ancestor form'})`, async () => {
      const formProps = external ? { form: 'reset-form' } : {};
      const controls = <>
        <NumberField defaultValue={2} aria-label="Number" {...formProps} />
        <SearchField defaultValue="initial" aria-label="Search" {...formProps} />
        <OTPField defaultValue="12" length={2} {...formProps} />
        <Toggle defaultPressed {...formProps}>Toggle</Toggle>
        <Switch defaultChecked {...formProps} aria-label="Switch" />
        <CheckboxGroup defaultValue={['a']} {...formProps}><CheckboxGroupItem value="a" aria-label="Check A" /></CheckboxGroup>
        <ToggleGroup type="single" defaultValue="a" {...formProps}><ToggleGroupItem value="a">Group A</ToggleGroupItem><ToggleGroupItem value="b">Group B</ToggleGroupItem></ToggleGroup>
        <ColorPicker defaultValue="#ff0000" {...formProps} />
        <ColorSwatchGroup defaultValue="#ff0000" {...formProps}><ColorSwatch color="#ff0000" /><ColorSwatch color="#00ff00" /></ColorSwatchGroup>
        <Slider defaultValue={[20]} aria-label="Level" {...formProps} />
        <RadioGroup defaultValue="a" {...formProps}><RadioGroupItem value="a">Radio A</RadioGroupItem><RadioGroupItem value="b">Radio B</RadioGroupItem></RadioGroup>
      </>;
      const { container } = render(external ? <><form id="reset-form" />{controls}</> : <form id="reset-form">{controls}</form>);
      fireEvent.click(screen.getByLabelText('Increase value'));
      fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'changed' } });
      fireEvent.change(screen.getByLabelText('Digit 1 of 2'), { target: { value: '9' } });
      fireEvent.click(screen.getByRole('button', { name: 'Toggle' }));
      fireEvent.click(screen.getByRole('switch'));
      fireEvent.click(screen.getByLabelText('Check A'));
      fireEvent.click(screen.getByRole('radio', { name: 'Group B' }));
      fireEvent.change(screen.getByLabelText('Brightness'), { target: { value: '0' } });
      fireEvent.click(screen.getByRole('radio', { name: '#00ff00' }));
      fireEvent.keyDown(screen.getByRole('slider', { name: 'Level' }), { key: 'End' });
      fireEvent.click(screen.getByRole('radio', { name: 'Radio B' }));
      await act(async () => { (container.querySelector('form') as HTMLFormElement).reset(); await Promise.resolve(); });
      expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('2');
      expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('initial');
      expect((screen.getByLabelText('Digit 1 of 2') as HTMLInputElement).value).toBe('1');
      expect(screen.getByRole('button', { name: 'Toggle' }).getAttribute('aria-pressed')).toBe('true');
      expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
      expect((screen.getByLabelText('Check A') as HTMLInputElement).checked).toBe(true);
      expect(screen.getByRole('radio', { name: 'Group A' }).getAttribute('aria-checked')).toBe('true');
      expect((screen.getByLabelText('Hex color') as HTMLInputElement).value.toLowerCase()).toBe('#ff0000');
      expect(screen.getByRole('radio', { name: '#ff0000' }).getAttribute('aria-checked')).toBe('true');
      expect(screen.getByRole('slider', { name: 'Level' }).getAttribute('aria-valuenow')).toBe('20');
      expect(screen.getByRole('radio', { name: 'Radio A' }).getAttribute('aria-checked')).toBe('true');
    });
  }
  it('cancelled reset and controlled values remain authoritative', async () => {
    const changes: number[] = [];
    const { container } = render(<form onReset={e => e.preventDefault()}><NumberField defaultValue={2} onValueChange={v => changes.push(v)} /><SearchField value="controlled" /></form>);
    fireEvent.click(screen.getByLabelText('Increase value'));
    await act(async () => { container.querySelector('form')!.reset(); await Promise.resolve(); });
    expect((screen.getByRole('spinbutton') as HTMLInputElement).value).toBe('3');
    expect(changes).toEqual([3]);
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('controlled');
  });
  it('density geometry, native checkbox masks and stepper targets use tokens', async () => {
    const css = await Bun.file(new URL('../src/styles/forms.css', import.meta.url)).text();
    expect(css).toContain('--onyx-switch-track-height');
    expect(css).toContain('--onyx-switch-thumb-travel');
    expect(css).toContain('var(--onyx-control-button-fg)');
    expect(css).toContain("[data-slot='number-field-steppers'] button)::after");
    expect(css).toContain('height: var(--onyx-space-6)');
    expect(css).not.toContain('onyx-checkbox-root');
    const { container } = render(<Select><SelectTrigger><SelectValue /></SelectTrigger></Select>);
    expect(container.querySelector('button')!.className).toContain('h-[var(--onyx-control-height-md)]');
    expect(container.querySelector('button')!.className).toContain('text-[length:var(--onyx-text-md)]');
  });
});
