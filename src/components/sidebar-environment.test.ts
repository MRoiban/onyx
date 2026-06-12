import { describe, expect, it, vi } from 'vitest';

import { createSidebarEnvironment } from './sidebar-environment';

function createFakeWindowAndDocument() {
  const listeners = new Map<string, Set<(event: PointerEvent) => void>>();
  const body = {
    style: {
      cursor: 'default',
      userSelect: 'auto'
    }
  };
  const windowObject = {
    addEventListener: vi.fn((type: string, listener: (event: PointerEvent) => void) => {
      const typeListeners = listeners.get(type) ?? new Set<(event: PointerEvent) => void>();
      typeListeners.add(listener);
      listeners.set(type, typeListeners);
    }),
    removeEventListener: vi.fn((type: string, listener: (event: PointerEvent) => void) => {
      listeners.get(type)?.delete(listener);
    }),
    dispatch(type: string, event: PointerEvent) {
      for (const listener of Array.from(listeners.get(type) ?? [])) {
        listener(event);
      }
    },
    listenerCount(type: string) {
      return listeners.get(type)?.size ?? 0;
    }
  } as unknown as Window & {
    dispatch(type: string, event: PointerEvent): void;
    listenerCount(type: string): number;
  };
  const documentObject = { body } as unknown as Document;

  return { body, documentObject, windowObject };
}

describe('createSidebarEnvironment', () => {
  it('resolves mobile state through injected media query handling', () => {
    const matchMedia = vi.fn(() => ({ matches: true }));

    const environment = createSidebarEnvironment({
      matchMedia
    });

    expect(environment.isMobile()).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith('(max-width: 768px)');
  });

  it('tracks WorkbenchSidebar resize through injected browser targets', () => {
    const { body, documentObject, windowObject } = createFakeWindowAndDocument();
    const sidebarElement = {
      getBoundingClientRect: vi.fn(() => ({ width: 320 }))
    } as unknown as HTMLElement;
    const onWidthChange = vi.fn();

    const cleanup = createSidebarEnvironment({
      document: documentObject,
      window: windowObject
    }).beginResize({
      fallbackWidth: 300,
      maxWidth: 420,
      minWidth: 200,
      onWidthChange,
      sidebarElement,
      startX: 100
    });

    expect(body.style.cursor).toBe('col-resize');
    expect(body.style.userSelect).toBe('none');
    windowObject.dispatch('pointermove', { clientX: 180 } as PointerEvent);
    windowObject.dispatch('pointermove', { clientX: 500 } as PointerEvent);

    expect(onWidthChange).toHaveBeenNthCalledWith(1, 400);
    expect(onWidthChange).toHaveBeenNthCalledWith(2, 420);

    cleanup();

    expect(body.style.cursor).toBe('default');
    expect(body.style.userSelect).toBe('auto');
    expect(windowObject.listenerCount('pointermove')).toBe(0);
    expect(windowObject.listenerCount('pointerup')).toBe(0);
    expect(windowObject.listenerCount('pointercancel')).toBe(0);
  });

  it('returns a no-op cleanup when resize has no browser targets', () => {
    const onWidthChange = vi.fn();
    const cleanup = createSidebarEnvironment({
      document: null,
      window: null
    }).beginResize({
      fallbackWidth: 300,
      maxWidth: 420,
      minWidth: 200,
      onWidthChange,
      sidebarElement: null,
      startX: 100
    });

    cleanup();

    expect(onWidthChange).not.toHaveBeenCalled();
  });
});
