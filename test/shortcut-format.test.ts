import {expect,test} from 'bun:test';
import {formatShortcut} from '../src/components/kbd';
test('shortcut chips preserve Mac chord/delete symbols and offer explicit Windows/Linux labels',()=>{
 expect(formatShortcut('cmdorctrl+shift+p')).toBe('⌘⇧P');
 expect(formatShortcut('cmd+k leftarrow')).toBe('⌘K ←');
 expect(formatShortcut('cmd+delete')).toBe('⌘⌫');
 expect(formatShortcut('ctrl+delete')).toBe('⌃⌦');
 expect(formatShortcut('ctrl+shift+p','windows')).toBe('Ctrl+Shift+P');
 expect(formatShortcut('cmd+k','linux')).toBe('Super+K');
});
