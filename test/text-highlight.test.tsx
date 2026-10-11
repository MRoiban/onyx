import {test,expect} from 'bun:test';
import {render,cleanup} from '@testing-library/react';
import * as React from 'react';
import {HighlightedText} from '../src/components/text';
import {calculateMeasuredVirtualWindow} from '../src/components/virtual-list';
test('highlight escapes literal terms, preserves text and whitespace, and marks multiple case-insensitive matches',()=>{
 const text='[Info] a+b A+B · file.ts  file.ts';const {container}=render(<HighlightedText text={text} terms={['a+b','file.ts','']} markProps={{className:'match'}}/>);
 expect(container.textContent).toBe(text);expect([...container.querySelectorAll('mark')].map(node=>node.textContent)).toEqual(['a+b','A+B','file.ts','file.ts']);expect(container.querySelector('.match')?.getAttribute('data-slot')).toBe('text-highlight');cleanup();
 const sensitive=render(<HighlightedText text='Alpha alpha' terms={['Alpha']} caseSensitive/>);expect(sensitive.container.querySelectorAll('mark').length).toBe(1);cleanup();
});
test('measured windows retain variable-height offsets and cover empty or out-of-range viewports',()=>{
 expect(calculateMeasuredVirtualWindow([18,30,90,18],48,90,0)).toEqual({start:2,end:3,before:48,after:18});
 expect(calculateMeasuredVirtualWindow([18,30,90,18],48,90,1)).toEqual({start:1,end:4,before:18,after:0});
 expect(calculateMeasuredVirtualWindow([],0,100)).toEqual({start:0,end:0,before:0,after:0});
 expect(calculateMeasuredVirtualWindow([18,30],200,10,0)).toEqual({start:2,end:2,before:48,after:0});
});
