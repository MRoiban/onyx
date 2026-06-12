import { describe, expect, it, vi } from 'vitest';

import { createSectionSelectEnvironment } from './section-select-environment';

describe('createSectionSelectEnvironment', () => {
  it('resolves browser window and document through injected targets', () => {
    const documentObject = {
      documentElement: {
        clientWidth: 800,
        clientHeight: 600
      }
    } as unknown as Document;
    const windowObject = {
      document: documentObject,
      innerWidth: 1024,
      innerHeight: 768
    } as unknown as Window;

    const environment = createSectionSelectEnvironment({
      window: windowObject
    });

    expect(environment.resolveWindow()).toBe(windowObject);
    expect(environment.resolveDocument()).toBe(documentObject);
    expect(environment.readViewport(documentObject, { width: 1, height: 1 })).toEqual({
      width: 1024,
      height: 768
    });
  });

  it('reads element geometry through the environment adapter', () => {
    const element = {
      getBoundingClientRect: vi.fn(() => ({
        bottom: 42,
        left: 12,
        width: 180
      }))
    } as unknown as HTMLElement;
    const environment = createSectionSelectEnvironment({
      window: null,
      document: null
    });

    expect(environment.readElementRect(element)).toEqual({
      bottom: 42,
      left: 12,
      width: 180
    });
    expect(element.getBoundingClientRect).toHaveBeenCalledTimes(1);
  });

  it('uses injected frame scheduling before falling back to timers', () => {
    const cancelAnimationFrame = vi.fn();
    const requestAnimationFrame = vi.fn(() => 9);
    const environment = createSectionSelectEnvironment({
      requestAnimationFrame,
      cancelAnimationFrame
    });
    const callback = vi.fn();

    expect(environment.requestFrame(callback)).toBe(9);
    environment.cancelFrame(9);

    expect(requestAnimationFrame).toHaveBeenCalledWith(callback);
    expect(cancelAnimationFrame).toHaveBeenCalledWith(9);
  });

  it('owns open-state document and window listeners', () => {
    const documentListeners = new Map<string, Set<(event: Event) => void>>();
    const windowListeners = new Map<string, Set<(event: Event) => void>>();
    const documentObject = {
      addEventListener: vi.fn((type: string, listener: (event: Event) => void) => {
        const listeners = documentListeners.get(type) ?? new Set<(event: Event) => void>();
        listeners.add(listener);
        documentListeners.set(type, listeners);
      }),
      removeEventListener: vi.fn((type: string, listener: (event: Event) => void) => {
        documentListeners.get(type)?.delete(listener);
      })
    } as unknown as Document;
    const windowObject = {
      addEventListener: vi.fn((type: string, listener: (event: Event) => void) => {
        const listeners = windowListeners.get(type) ?? new Set<(event: Event) => void>();
        listeners.add(listener);
        windowListeners.set(type, listeners);
      }),
      removeEventListener: vi.fn((type: string, listener: (event: Event) => void) => {
        windowListeners.get(type)?.delete(listener);
      })
    } as unknown as Window;
    const onOutsidePointerDown = vi.fn();
    const onEscape = vi.fn();
    const onWindowChange = vi.fn();

    const release = createSectionSelectEnvironment().retainOpenInteractionHandlers({
      documentObject,
      isTargetInside: () => false,
      onEscape,
      onOutsidePointerDown,
      onWindowChange,
      windowObject
    });

    documentListeners.get('pointerdown')?.forEach((listener) => listener({ target: {} } as Event));
    documentListeners.get('keydown')?.forEach((listener) => listener({
      key: 'Escape',
      preventDefault: vi.fn()
    } as unknown as KeyboardEvent));
    windowListeners.get('resize')?.forEach((listener) => listener({} as Event));

    expect(onOutsidePointerDown).toHaveBeenCalledTimes(1);
    expect(onEscape).toHaveBeenCalledTimes(1);
    expect(onWindowChange).toHaveBeenCalledTimes(1);

    release();

    expect(documentListeners.get('pointerdown')?.size).toBe(0);
    expect(documentListeners.get('keydown')?.size).toBe(0);
    expect(windowListeners.get('resize')?.size).toBe(0);
    expect(windowListeners.get('scroll')?.size).toBe(0);
  });
});
