import { describe, expect, it } from 'bun:test';
import { findTreeTypeAheadMatch, resolveTreeNavigationAction, type TreeNavigationItem } from '../src/lib/tree-navigation';

const rows: TreeNavigationItem<string>[] = [
  { key: 'a', depth: 0, branch: true, expanded: true, label: 'Animals', data: 'Animals' },
  { key: 'ant', depth: 1, branch: false, expanded: false, label: 'Ant', data: 'Ant' },
  { key: 'ape', depth: 1, branch: false, expanded: false, label: 'Ape', data: 'Ape' },
  { key: 'b', depth: 0, branch: true, expanded: false, label: 'Birds', data: 'Birds' },
  { key: 'cat', depth: 0, branch: false, expanded: false, label: 'Cat', data: 'Cat' },
];
const action = (key: string, focusedKey: string | null, shiftKey = false) =>
  resolveTreeNavigationAction(key, { rows, focusedKey, shiftKey });

describe('Tree navigation on consumer-owned visible rows', () => {
  it('starts from an absent focus, clamps traversal and preserves range-extension requests', () => {
    for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'ArrowRight', 'ArrowLeft'])
      expect(action(key, null, true)).toEqual({ type: 'focus', key: 'a', item: 'Animals', extend: true });
    expect(action('End', null)).toEqual({ type: 'focus', key: 'cat', item: 'Cat', extend: false });
    expect(action('Enter', null)).toBeNull();
    expect(action('ArrowUp', 'a')).toEqual({ type: 'focus', key: 'a', item: 'Animals', extend: false });
    expect(action('ArrowDown', 'cat')).toEqual({ type: 'focus', key: 'cat', item: 'Cat', extend: false });
    expect(action('ArrowDown', 'ant', true)).toEqual({ type: 'focus', key: 'ape', item: 'Ape', extend: true });
    expect(action('Home', 'ape')).toEqual({ type: 'focus', key: 'a', item: 'Animals', extend: false });
    expect(action('End', 'ape')).toEqual({ type: 'focus', key: 'cat', item: 'Cat', extend: false });
    expect(action('Unrecognized', 'ape')).toBeNull();
    expect(resolveTreeNavigationAction('ArrowDown', { rows: [], focusedKey: null })).toBeNull();
  });

  it('opens/closes branches, enters immediate children, returns to a parent and dispatches activation', () => {
    expect(action('ArrowRight', 'b')).toEqual({ type: 'toggle', key: 'b', item: 'Birds' });
    expect(action('ArrowRight', 'a', true)).toEqual({ type: 'focus', key: 'ant', item: 'Ant', extend: true });
    expect(action('ArrowRight', 'ant')).toBeNull();
    expect(action('ArrowLeft', 'a')).toEqual({ type: 'toggle', key: 'a', item: 'Animals' });
    expect(action('ArrowLeft', 'ant', true)).toEqual({ type: 'focus', key: 'a', item: 'Animals', extend: false });
    expect(action('ArrowLeft', 'b')).toBeNull();
    expect(action('Enter', 'ant')).toEqual({ type: 'activate', key: 'ant', item: 'Ant' });
    expect(action('Enter', 'a')).toEqual({ type: 'activate', key: 'a', item: 'Animals' });
    expect(rows[0].expanded).toBe(true);
    expect(rows[3].expanded).toBe(false); // Helpers report actions and never mutate the collection.
  });

  it('skips disabled rows while retaining preorder topology for child and parent navigation', () => {
    const disabled = rows.map(row => ({ ...row, disabled: row.key === 'ant' }));
    expect(resolveTreeNavigationAction('ArrowRight', { rows: disabled, focusedKey: 'a' }))
      .toEqual({ type: 'focus', key: 'ape', item: 'Ape', extend: false });
    expect(resolveTreeNavigationAction('ArrowDown', { rows: disabled, focusedKey: 'a' }))
      .toEqual({ type: 'focus', key: 'ape', item: 'Ape', extend: false });
    expect(findTreeTypeAheadMatch(disabled, 'a', 'a')).toBe('Ape');
    const nested = [
      { key: 0, depth: 0, branch: true, expanded: true, label: 'Root', data: 0 },
      { key: 1, depth: 1, branch: true, expanded: true, label: 'Disabled branch', data: 1, disabled: true },
      { key: 2, depth: 2, branch: false, expanded: false, label: 'Grandchild', data: 2 },
      { key: 3, depth: 1, branch: false, expanded: false, label: 'Direct child', data: 3 },
    ];
    expect(resolveTreeNavigationAction('ArrowRight', { rows: nested, focusedKey: 0 }))
      .toEqual({ type: 'focus', key: 3, item: 3, extend: false });
    expect(resolveTreeNavigationAction('ArrowLeft', { rows: nested, focusedKey: 2 })).toBeNull();
  });

  it('cycles repeated characters, refines prefixes on the current row and wraps without changing selection', () => {
    expect(findTreeTypeAheadMatch(rows, 'a', 'a')).toBe('Ant');
    expect(findTreeTypeAheadMatch(rows, 'ant', 'aa')).toBe('Ape');
    expect(findTreeTypeAheadMatch(rows, 'ape', 'AAA')).toBe('Animals');
    expect(findTreeTypeAheadMatch(rows, 'ant', 'an')).toBe('Ant');
    expect(findTreeTypeAheadMatch(rows, 'cat', 'bi')).toBe('Birds');
    expect(findTreeTypeAheadMatch(rows, null, 'a')).toBe('Animals');
    expect(findTreeTypeAheadMatch(rows, 'a', 'missing')).toBeNull();
    expect(findTreeTypeAheadMatch(rows, 'a', '')).toBeNull();
    expect(findTreeTypeAheadMatch([], null, 'a')).toBeNull();
  });
});
