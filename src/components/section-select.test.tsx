import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  SectionSelect,
  getSectionSelectMenuPosition,
  retainSectionSelectDocumentSelectionLock
} from './section-select';

function createFakeDocument(): Document & {
  added: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }>;
  removed: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }>;
  classNames: Set<string>;
  dispatchFakeEvent(type: string, event: Event): void;
} {
  const listeners = new Map<string, Set<EventListener>>();
  const classNames = new Set<string>();
  const added: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }> = [];
  const removed: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }> = [];

  return {
    body: {
      classList: {
        add: (className: string) => {
          classNames.add(className);
        },
        remove: (className: string) => {
          classNames.delete(className);
        },
        contains: (className: string) => classNames.has(className)
      }
    },
    added,
    removed,
    classNames,
    addEventListener(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
      added.push({ type, listener, options });
      const eventListeners = listeners.get(type) ?? new Set<EventListener>();
      eventListeners.add(listener);
      listeners.set(type, eventListeners);
    },
    removeEventListener(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
      removed.push({ type, listener, options });
      listeners.get(type)?.delete(listener);
    },
    dispatchFakeEvent(type: string, event: Event) {
      for (const listener of Array.from(listeners.get(type) ?? [])) {
        listener(event);
      }
    }
  } as unknown as Document & {
    added: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }>;
    removed: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }>;
    classNames: Set<string>;
    dispatchFakeEvent(type: string, event: Event): void;
  };
}

describe('SectionSelect', () => {
  it('renders a non-modal workbench selector trigger without Radix select globals', () => {
    const html = renderToStaticMarkup(
      <SectionSelect
        ariaLabel="Switch section"
        value="source"
        items={[
          { value: 'translations', icon: 'home', label: 'Translations' },
          { value: 'source', icon: 'code', label: 'Source' }
        ]}
        onValueChange={() => {}}
        triggerId="workspace-switcher-btn"
        valueId="workspace-title"
      />
    );

    expect(html).toContain('data-slot="section-select-trigger"');
    expect(html).toContain('role="combobox"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('id="workspace-title"');
    expect(html).toContain('select-none');
    expect(html).toContain('Source');
    expect(html).not.toContain('data-slot="select-trigger"');
    expect(html).not.toContain('data-slot="dialog-overlay"');
  });

  it('clamps menu placement to the viewport while preserving trigger width', () => {
    expect(
      getSectionSelectMenuPosition(
        { bottom: 42, left: 740, width: 180 },
        { width: 800, height: 600 }
      )
    ).toEqual({
      top: 46,
      left: 568,
      minWidth: 224,
      maxHeight: 546
    });
  });

  it('can render with an explicit headless environment', () => {
    const html = renderToStaticMarkup(
      <SectionSelect
        ariaLabel="Switch section"
        value="source"
        items={[
          { value: 'translations', icon: 'home', label: 'Translations' },
          { value: 'source', icon: 'code', label: 'Source' }
        ]}
        onValueChange={() => {}}
        environment={{
          window: null,
          document: null
        }}
      />
    );

    expect(html).toContain('data-slot="section-select-trigger"');
    expect(html).toContain('Source');
  });

  it('retains selection suppression per document without leaking the body class', () => {
    const documentObject = createFakeDocument();

    const releaseFirst = retainSectionSelectDocumentSelectionLock(documentObject);
    const releaseSecond = retainSectionSelectDocumentSelectionLock(documentObject);

    expect(documentObject.classNames.has('onyx-section-select-open')).toBe(true);
    expect(documentObject.added.map((entry) => entry.type)).toEqual([
      'selectstart',
      'dragstart',
      'selectionchange'
    ]);

    const selectStartEvent = { preventDefault: vi.fn() } as unknown as Event;
    documentObject.dispatchFakeEvent('selectstart', selectStartEvent);
    expect(selectStartEvent.preventDefault).toHaveBeenCalledTimes(1);

    releaseFirst();
    releaseFirst();
    expect(documentObject.classNames.has('onyx-section-select-open')).toBe(true);
    expect(documentObject.removed).toEqual([]);

    releaseSecond();
    expect(documentObject.classNames.has('onyx-section-select-open')).toBe(false);
    expect(documentObject.removed.map((entry) => entry.type)).toEqual([
      'selectstart',
      'dragstart',
      'selectionchange'
    ]);
  });

  it('clears existing and newly-created text selection while the selector is open', () => {
    const documentObject = createFakeDocument();
    const selection = {
      removeAllRanges: vi.fn()
    } as unknown as Selection;

    const release = retainSectionSelectDocumentSelectionLock(documentObject, {
      getSelection: () => selection
    });

    expect(selection.removeAllRanges).toHaveBeenCalledTimes(1);

    documentObject.dispatchFakeEvent('selectionchange', {} as Event);

    expect(selection.removeAllRanges).toHaveBeenCalledTimes(2);

    release();
    documentObject.dispatchFakeEvent('selectionchange', {} as Event);

    expect(selection.removeAllRanges).toHaveBeenCalledTimes(2);
  });

  it('scopes selection suppression independently across documents', () => {
    const firstDocument = createFakeDocument();
    const secondDocument = createFakeDocument();

    const releaseFirst = retainSectionSelectDocumentSelectionLock(firstDocument);
    const releaseSecond = retainSectionSelectDocumentSelectionLock(secondDocument);

    releaseFirst();

    expect(firstDocument.classNames.has('onyx-section-select-open')).toBe(false);
    expect(secondDocument.classNames.has('onyx-section-select-open')).toBe(true);

    releaseSecond();
    expect(secondDocument.classNames.has('onyx-section-select-open')).toBe(false);
  });

  it('keeps browser fallback and geometry reads out of the React component', () => {
    const source = readFileSync(new URL('./section-select.tsx', import.meta.url), 'utf8');

    expect(source).not.toContain('typeof window');
    expect(source).not.toContain('typeof document');
    expect(source).not.toContain('getBoundingClientRect');
    expect(source).not.toContain('addEventListener');
    expect(source).not.toContain('removeEventListener');
    expect(source).not.toContain('body.classList.add');
    expect(source).not.toContain('body.classList.remove');
  });
});
