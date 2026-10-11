import { describe, expect, it } from 'bun:test';
import { calculateOverlayScrollbarMetrics } from '../src/components/overlay-scrollbar';

describe('OverlayScrollbar geometry', () => {
  it('hides when there is no scrollable content', () => {
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 0, scrollHeight: 100, scrollTop: 0 })).toEqual({ visible: false, thumbHeight: 0, thumbOffset: 0 });
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 100, scrollHeight: 100, scrollTop: 0 })).toEqual({ visible: false, thumbHeight: 0, thumbOffset: 0 });
  });

  it('keeps an oversized minimum thumb inside a tiny viewport', () => {
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 12, scrollHeight: 1200, scrollTop: 1188 })).toEqual({ visible: true, thumbHeight: 12, thumbOffset: 0 });
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 32, scrollHeight: 3200, scrollTop: 200, minThumbHeight: 48 })).toEqual({ visible: true, thumbHeight: 32, thumbOffset: 0 });
  });

  it('maps both scroll boundaries and clamps browser overscroll', () => {
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 100, scrollHeight: 400, scrollTop: 150 })).toEqual({ visible: true, thumbHeight: 25, thumbOffset: 37.5 });
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 100, scrollHeight: 400, scrollTop: -40 }).thumbOffset).toBe(0);
    expect(calculateOverlayScrollbarMetrics({ clientHeight: 100, scrollHeight: 400, scrollTop: 900 }).thumbOffset).toBe(75);
  });
});
