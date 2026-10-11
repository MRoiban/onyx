import { describe, expect, it } from 'bun:test';
import { calculateFixedVirtualListWindow } from '../src/components/fixed-virtual-list';

const rows = Array.from({ length: 100 }, (_, index) => ({ id: `row-${index}` }));

describe('Fixed-height virtual window geometry', () => {
  it('renders viewport rows plus overscan and preserves total space', () => {
    const result = calculateFixedVirtualListWindow({ rows, rowHeight: 20, scrollTop: 165, viewportHeight: 100, overscan: 2 });
    expect(result).toEqual({ startIndex: 6, endIndex: 15, rows: rows.slice(6, 15), paddingTop: 120, paddingBottom: 1700, totalHeight: 2000 });
  });

  it('centers a requested anchor temporarily, with bounded edge windows', () => {
    expect(calculateFixedVirtualListWindow({ rows, rowHeight: 20, scrollTop: 0, viewportHeight: 100, overscan: 0, anchorIndex: 80 }).startIndex).toBe(78);
    expect(calculateFixedVirtualListWindow({ rows, rowHeight: 20, scrollTop: 40000, viewportHeight: 100, overscan: 0 }).startIndex).toBe(95);
    expect(calculateFixedVirtualListWindow({ rows, rowHeight: 20, scrollTop: -100, viewportHeight: 100, overscan: -10 }).startIndex).toBe(0);
  });

  it('handles empty and short lists without negative padding', () => {
    expect(calculateFixedVirtualListWindow({ rows: [], rowHeight: 20, scrollTop: 500, viewportHeight: 100, anchorIndex: 12 })).toEqual({ startIndex: 0, endIndex: 0, rows: [], paddingTop: 0, paddingBottom: 0, totalHeight: 0 });
    expect(calculateFixedVirtualListWindow({ rows: rows.slice(0, 2), rowHeight: 20, scrollTop: 500, viewportHeight: 100, overscan: 0 })).toEqual({ startIndex: 0, endIndex: 2, rows: rows.slice(0, 2), paddingTop: 0, paddingBottom: 0, totalHeight: 40 });
  });
});
