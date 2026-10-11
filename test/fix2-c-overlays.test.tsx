import { expect, it } from 'bun:test';
import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Combobox, useCombobox } from '../src/components/combobox';
import { DatePicker } from '../src/components/date-picker';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '../src/components/dialog';
const options = [{value:'a',label:'Alpha'}, {value:'b',label:'Beta'}];

it('R10 controlled Combobox restores the accepted label after rejected pointer and keyboard selections', async () => {
 const requests: unknown[]=[];
 render(<Combobox value="a" filter={false} options={options} onValueChange={v=>requests.push(v)}/>);
 const input=screen.getByRole('combobox') as HTMLInputElement;
 act(()=>input.focus());
 fireEvent.mouseDown(screen.getByRole('option',{name:'Beta'}));
 fireEvent.click(screen.getByRole('option',{name:'Beta'}));
 expect(requests).toEqual(['b']); expect(input.value).toBe('Alpha');
 fireEvent.change(input,{target:{value:''}});
 fireEvent.keyDown(input,{key:'ArrowDown'}); fireEvent.keyDown(input,{key:'ArrowDown'}); fireEvent.keyDown(input,{key:'Enter'});
 expect(requests).toEqual(['b','b']); expect(input.value).toBe('Alpha');
 await act(async()=>{});
});
it('R10 controlled Combobox reconciles a draft when the parent reasserts the same value', async () => {
 const view=render(<Combobox value="a" options={options}/>);
 const input=screen.getByRole('combobox') as HTMLInputElement;
 fireEvent.change(input,{target:{value:'draft'}}); expect(input.value).toBe('draft');
 view.rerender(<Combobox value="a" options={options}/>); expect(input.value).toBe('Alpha');
 await act(async()=>{});
});
it('R11 Dialog hosts nested portals and preserves content refs and asChild structural parts', async () => {
 const ref=React.createRef<HTMLDivElement>(); let chosen: unknown;
 render(<Dialog defaultOpen><DialogContent asChild ref={ref}><div data-testid="host">
 <DialogHeader asChild><header><DialogTitle>Nested Dialog</DialogTitle><DialogDescription>Choose</DialogDescription></header></DialogHeader>
 <Combobox label="Dialog choice" options={options} onValueChange={v=>chosen=v}/>
 <DatePicker label="Dialog date" defaultValue={new Date(2026,9,6)}/>
 <DialogFooter asChild><footer>Footer</footer></DialogFooter>
 </div></DialogContent></Dialog>);
 const input=screen.getByRole('combobox'); act(()=>input.focus());
 expect(ref.current).toBe(screen.getByTestId('host'));
 expect(ref.current?.dataset.slot).toBe('dialog-content');
 expect(ref.current?.contains(screen.getByRole('listbox'))).toBe(true);
 expect(document.querySelector('[data-slot="dialog-header"]')?.tagName).toBe('HEADER');
 expect(document.querySelector('[data-slot="dialog-footer"]')?.tagName).toBe('FOOTER');
 fireEvent.mouseDown(screen.getByRole('option',{name:'Beta'})); fireEvent.click(screen.getByRole('option',{name:'Beta'})); expect(chosen).toBe('b');
 fireEvent.click(screen.getByRole('button',{name:/Open calendar/}));
 expect(ref.current?.contains(screen.getByRole('button',{name:'Next month'}))).toBe(true);
 fireEvent.click(screen.getByRole('button',{name:'Next month'})); expect(screen.getByText('November 2026')).toBeTruthy();
 await act(async()=>{});
});

it('R10 headless controlled Combobox keeps a local typing draft and rejects an unaccepted selection label', async () => {
 function Custom() {
  const state=useCombobox({value:'a',options,filter:false,onValueChange:()=>{}});
  return <><input {...state.inputProps}/><button onClick={()=>state.select(1)}>Choose Beta</button></>;
 }
 render(<Custom/>);const input=screen.getByRole('combobox') as HTMLInputElement;
 fireEvent.change(input,{target:{value:'typing'}});expect(input.value).toBe('typing');
 fireEvent.click(screen.getByRole('button',{name:'Choose Beta'}));expect(input.value).toBe('Alpha');
 await act(async()=>{});
});
