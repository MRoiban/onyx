import { it, expect } from 'bun:test';
import * as React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Combobox } from '../src/components/combobox';
import { DatePicker } from '../src/components/date-picker';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../src/components/sheet';
import { Menu, MenuContent, MenuItem } from '../src/components/menu';
import { Popover, PopoverContent, PopoverArrow } from '../src/components/popover';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from '../src/components/alert-dialog';
const options = [{ value: 'a', label: 'Alpha' }, { value: 'b', label: 'Beta' }];
it('modal Sheet portals are interactive and nested floating parts stay inside its stacking context', async () => {
 let value: unknown;
 render(<Sheet defaultOpen><SheetContent><SheetTitle>Nested</SheetTitle><SheetDescription>Test</SheetDescription>
 <button type="button">Other control</button>
 <Combobox label="Nested choice" options={options} onValueChange={v => value = v}/>
 <Menu open modal={false}><MenuContent><MenuItem>Action</MenuItem></MenuContent></Menu>
 <Popover open><PopoverContent onOpenAutoFocus={e => e.preventDefault()}>Panel</PopoverContent></Popover>
 </SheetContent></Sheet>);
 const input = screen.getByRole('combobox');
 act(() => input.focus());
 const list = screen.getByRole('listbox');
 const host = document.querySelector('[data-slot="sheet-content"]')!;
 expect(host.contains(list)).toBe(true);
 expect(host.contains(screen.getByRole('menu'))).toBe(true);
 expect(host.contains(screen.getByText('Panel'))).toBe(true);
 expect(list.style.pointerEvents).toBe('auto');
 expect(getComputedStyle(list).pointerEvents).toBe('auto');
 fireEvent.pointerDown(screen.getByRole('option', { name: 'Beta' }));
 fireEvent.mouseDown(screen.getByRole('option', { name: 'Beta' }));
 fireEvent.click(screen.getByRole('option', { name: 'Beta' }));
 expect(value).toBe('b');
 expect(host.isConnected).toBe(true);
 act(() => input.focus());
 fireEvent.change(input, { target: { value: '' } });
 fireEvent.keyDown(input, { key: 'ArrowDown' });
 fireEvent.keyDown(input, { key: 'Enter' });
 expect(value).toBe('a');
 fireEvent.change(input, { target: { value: '' } });
 fireEvent.keyDown(input, { key: 'Escape' });
 expect(screen.queryByRole('listbox')).toBeNull();
 expect(host.isConnected).toBe(true);
 fireEvent.change(input, { target: { value: '' } });
 await act(async () => { await new Promise(resolve => setTimeout(resolve, 1)); });
 fireEvent.pointerDown(screen.getByRole('button', {name: 'Other control'}));
 expect(screen.queryByRole('listbox')).toBeNull();
 expect(host.isConnected).toBe(true);
 await act(async () => {});
});
it('Combobox refreshes selected labels without replacing an active query', () => {
 for (const controlled of [false, true]) {
 const props = controlled ? {value: 'a'} : {defaultValue: 'a'};
 const view = render(<Combobox {...props} options={[]} />);
 const input = screen.getByRole('combobox') as HTMLInputElement;
 view.rerender(<Combobox {...props} options={options}/>);
 expect(input.value).toBe('Alpha');
 view.rerender(<Combobox {...props} options={[{value:'a', label:'Updated'}]}/>);
 expect(input.value).toBe('Updated');
 fireEvent.change(input, {target:{value:'user query'}});
 view.rerender(<Combobox {...props} options={options}/>);
 expect(input.value).toBe(controlled ? 'Alpha' : 'user query');
 view.unmount();
 }
});
it('Combobox preserves active option identity across reorder and clears removed/create options', async () => {
 let chosen: unknown;
 const view = render(<Combobox options={options} filter={false} onValueChange={v => chosen=v} onCreate={() => {}}/>);
 const input = screen.getByRole('combobox');
 fireEvent.keyDown(input, {key:'ArrowDown'});
 view.rerender(<Combobox options={[options[1], options[0]]} filter={false} onValueChange={v => chosen=v}/>);
 fireEvent.keyDown(input, {key:'Enter'});
 expect(chosen).toBe('a');
 fireEvent.change(input, {target:{value:''}});
 fireEvent.keyDown(input, {key:'ArrowDown'});
 view.rerender(<Combobox options={[options[0]]} filter={false} onValueChange={v => chosen=v}/>);
 expect(input.getAttribute('aria-activedescendant')).toBeNull();
 fireEvent.keyDown(input, {key:'Enter'});
 expect(chosen).toBe('a');
 view.rerender(<Combobox options={[]} filter={false} onCreate={() => {}}/>);
 fireEvent.change(input, {target:{value:'new'}});
 fireEvent.keyDown(input, {key:'ArrowDown'});
 expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
 view.rerender(<Combobox options={[]} filter={false}/>);
 expect(input.getAttribute('aria-activedescendant')).toBeNull();
 await act(async () => {});
});
it('DatePicker submits the committed ISO value and preserves it on invalid drafts', () => {
 render(<form data-testid="form"><DatePicker name="date" defaultValue={new Date(2026,9,6)}/></form>);
 const input = screen.getByRole('textbox');
 const form = screen.getByTestId('form') as HTMLFormElement;
 expect(input.hasAttribute('name')).toBe(false);
 fireEvent.change(input,{target:{value:'invalid'}});
 fireEvent.blur(input);
 expect(input.getAttribute('aria-invalid')).toBe('true');
 expect(new FormData(form).get('date')).toBe('2026-10-06');
 fireEvent.change(input,{target:{value:'2026-10-09'}});
 fireEvent.keyDown(input,{key:'Enter'});
 expect(new FormData(form).get('date')).toBe('2026-10-09');
});
it('controlled DatePicker displays the controlled value after rejected typing and calendar selections', async () => {
 const value = new Date(2026,9,6);
 render(<DatePicker value={value} name="date" defaultMonth={value} onValueChange={() => {}}/>);
 const input = screen.getByRole('textbox') as HTMLInputElement;
 fireEvent.change(input,{target:{value:'2026-10-09'}});
 fireEvent.keyDown(input,{key:'Enter'});
 expect(input.value).toBe('2026-10-06');
 fireEvent.click(screen.getByRole('button',{name:/Open calendar/}));
 const day = document.querySelector<HTMLButtonElement>('[data-slot="calendar-day"]:not([disabled])')!;
 fireEvent.click(day);
 await waitFor(() => expect(input.value).toBe('2026-10-06'));
});
it('DatePicker range form association accepts root form and inputProps.form', () => {
 for (const props of [{form:'external'}, {inputProps:{form:'external'}}]) {
 const view = render(<><form id="external"/><DatePicker {...props} name="range" mode="range" defaultValue={{from:new Date(2026,9,6),to:new Date(2026,9,9)}}/></>);
 const form = document.getElementById('external') as HTMLFormElement;
 expect(new FormData(form).get('range')).toBe('2026-10-06');
 expect(new FormData(form).get('range.to')).toBe('2026-10-09');
 view.unmount();
 }
});
it('composite root styling and refs are separate from input props and legacy input refs', () => {
 for (const Component of [Combobox, DatePicker]) {
 const root = React.createRef<HTMLDivElement>(); const input = React.createRef<HTMLInputElement>();
 const view = render(<Component options={options} ref={input} rootRef={root} className="root-class" style={{opacity:0.8}} rootProps={{'aria-label':'Root',className:'extra-root'}} inputProps={{className:'input-class'}}/>);
 expect(root.current?.classList.contains('root-class')).toBe(true);
 expect(root.current?.classList.contains('extra-root')).toBe(true);
 expect(root.current?.style.opacity).toBe('0.8');
 expect(input.current?.classList.contains('input-class')).toBe(true);
 expect(input.current?.classList.contains('root-class')).toBe(false);
 view.unmount();
 }
});
it('AlertDialog floating Combobox remains in its focus scope and accepts pointer selection', async () => {
 let chosen: unknown;
 render(<AlertDialog defaultOpen><AlertDialogContent><AlertDialogTitle>Choose</AlertDialogTitle><AlertDialogDescription>Choose a language</AlertDialogDescription><Combobox options={options} onValueChange={v=>chosen=v}/><AlertDialogCancel>Cancel</AlertDialogCancel></AlertDialogContent></AlertDialog>);
 const input=screen.getByRole('combobox');act(()=>input.focus());
 expect(document.querySelector('[data-slot="alert-dialog-content"]')?.contains(screen.getByRole('listbox'))).toBe(true);
 fireEvent.mouseDown(screen.getByRole('option',{name:'Beta'}));fireEvent.click(screen.getByRole('option',{name:'Beta'}));
 expect(chosen).toBe('b');
 await act(async () => {});
});
it('Popover scroll wrapper preserves a direct arrow outside scrolling content', () => {
 render(<Popover open><PopoverContent style={{maxHeight:'100px'}} onOpenAutoFocus={e=>e.preventDefault()}><PopoverArrow/><p>Long content</p></PopoverContent></Popover>);
 const scroller=document.querySelector<HTMLElement>('[data-slot="popover-scroll"]')!;
 expect(scroller.style.maxHeight).toBe('');
 expect(scroller.contains(screen.getByText('Long content'))).toBe(true);
 expect(scroller.querySelector('[data-slot="popover-arrow"]')).toBeNull();
 expect(scroller.parentElement?.querySelector('[data-slot="popover-arrow"]')).toBeTruthy();
});

it('DatePicker reconciles a typed draft when the parent reasserts the same controlled Date', () => {
 const value = new Date(2026,9,6);
 const view=render(<DatePicker value={value}/>);
 const input=screen.getByRole('textbox') as HTMLInputElement;
 fireEvent.change(input,{target:{value:'2026-10-'}});
 expect(input.value).toBe('2026-10-');
 view.rerender(<DatePicker value={value}/>);
 expect(input.value).toBe('2026-10-06');
});

it('Combobox default active option also follows its value across reorder', async () => {
 let chosen: unknown;
 const view=render(<Combobox defaultOpen defaultActiveIndex={0} filter={false} options={options} onValueChange={v=>chosen=v}/>);
 view.rerender(<Combobox defaultOpen defaultActiveIndex={0} filter={false} options={[options[1],options[0]]} onValueChange={v=>chosen=v}/>);
 fireEvent.keyDown(screen.getByRole('combobox'),{key:'Enter'});
 expect(chosen).toBe('a');
 await act(async () => {});
});
