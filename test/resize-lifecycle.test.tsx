import {expect,test} from 'bun:test';
import {fireEvent,render,cleanup} from '@testing-library/react';
import {ResizeHandle} from '../src/components/resize-handle';
import * as React from 'react';
test('keyboard and reset commit resize values before completion for persistent consumers',()=>{
 const calls:string[]=[];
 let pending=240,committed=240;
 const {getByRole}=render(<ResizeHandle value={240} defaultValue={200} min={100} max={500} onResizeStart={()=>calls.push('start')} onValueChange={value=>{pending=value;calls.push('change');}} onResizeEnd={()=>{committed=pending;calls.push('end');}}/>);
 const handle=getByRole('separator');fireEvent.keyDown(handle,{key:'ArrowRight'});expect(committed).toBe(250);expect(calls).toEqual(['start','change','end']);
 calls.length=0;fireEvent.keyDown(handle,{key:'End'});expect(committed).toBe(500);expect(calls).toEqual(['start','change','end']);
 calls.length=0;fireEvent.doubleClick(handle);expect(committed).toBe(200);expect(calls).toEqual(['start','change','end']);
 calls.length=0;fireEvent.keyDown(handle,{key:'a'});expect(calls).toEqual([]);cleanup();
});
