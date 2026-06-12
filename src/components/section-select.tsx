import * as React from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../lib/cn';
import { Icon } from './icon';
import {
  createSectionSelectEnvironment,
  type SectionSelectEnvironment,
  type SectionSelectResolvedEnvironment,
  type SectionSelectViewport
} from './section-select-environment';

const MENU_GAP = 4;
const MENU_MARGIN = 8;
const DEFAULT_MENU_MIN_WIDTH = 224;
export { createSectionSelectEnvironment };
export type {
  SectionSelectEnvironment,
  SectionSelectResolvedEnvironment
} from './section-select-environment';

export interface SectionSelectItem<TValue extends string> {
  value: TValue;
  icon: string;
  label: string;
}

export interface SectionSelectProps<TValue extends string> {
  value: TValue;
  items: readonly SectionSelectItem<TValue>[];
  onValueChange: (value: TValue) => void;
  ariaLabel: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerId?: string;
  valueId?: string;
  triggerClassName?: string;
  contentClassName?: string;
  environment?: SectionSelectEnvironment;
}

interface MenuPosition {
  top: number;
  left: number;
  minWidth: number;
  maxHeight: number;
}

function getSelectedIndex<TValue extends string>(
  items: readonly SectionSelectItem<TValue>[],
  value: TValue
): number {
  return Math.max(0, items.findIndex((item) => item.value === value));
}

export function getSectionSelectMenuPosition(
  rect: Pick<DOMRect, 'bottom' | 'left' | 'width'>,
  viewport: SectionSelectViewport
): MenuPosition {
  const minWidth = Math.max(rect.width, DEFAULT_MENU_MIN_WIDTH);
  const availableBelow = Math.max(
    120,
    viewport.height - rect.bottom - MENU_GAP - MENU_MARGIN
  );
  const left = Math.min(
    Math.max(MENU_MARGIN, rect.left),
    Math.max(MENU_MARGIN, viewport.width - minWidth - MENU_MARGIN)
  );

  return {
    top: rect.bottom + MENU_GAP,
    left,
    minWidth,
    maxHeight: availableBelow
  };
}

function getMenuPosition(
  trigger: HTMLElement,
  resolvedEnvironment: SectionSelectResolvedEnvironment
): MenuPosition | null {
  const windowObject = resolvedEnvironment.resolveWindow();
  const documentObject = resolvedEnvironment.resolveDocument();
  if (!windowObject && !documentObject) {
    return null;
  }

  const rect = resolvedEnvironment.readElementRect(trigger);
  const viewport = resolvedEnvironment.readViewport(documentObject, {
    width: DEFAULT_MENU_MIN_WIDTH + MENU_MARGIN * 2,
    height: rect.bottom + MENU_GAP + MENU_MARGIN + 120
  });

  return getSectionSelectMenuPosition(rect, viewport);
}

function preventPointerSelection(
  event: Pick<React.PointerEvent | React.MouseEvent, 'button' | 'ctrlKey' | 'preventDefault'>,
  resolvedEnvironment: SectionSelectResolvedEnvironment,
  documentObject: Document | null
): void {
  if (event.button === 0 && !event.ctrlKey) {
    event.preventDefault();
    resolvedEnvironment.clearAmbientSelection(documentObject);
  }
}

export function retainSectionSelectDocumentSelectionLock(
  documentObject: Document | null,
  environment?: SectionSelectEnvironment
): () => void {
  return createSectionSelectEnvironment(environment).retainDocumentSelectionLock(documentObject);
}

export function SectionSelect<TValue extends string>({
  value,
  items,
  onValueChange,
  ariaLabel,
  open,
  onOpenChange,
  triggerId,
  valueId,
  triggerClassName,
  contentClassName,
  environment
}: SectionSelectProps<TValue>): React.ReactElement {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const reactId = React.useId();
  const contentId = `${triggerId ?? reactId}-menu`;
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [position, setPosition] = React.useState<MenuPosition | null>(null);
  const selectedIndex = getSelectedIndex(items, value);
  const [activeIndex, setActiveIndex] = React.useState(selectedIndex);
  const isOpen = open ?? internalOpen;
  const selectedItem = items[selectedIndex] ?? items[0];
  const resolvedEnvironment = React.useMemo(
    () => createSectionSelectEnvironment(environment),
    [environment]
  );
  const windowObject = resolvedEnvironment.resolveWindow();
  const documentObject = resolvedEnvironment.resolveDocument();

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      resolvedEnvironment.clearAmbientSelection(documentObject);

      if (open === undefined) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [documentObject, onOpenChange, open, resolvedEnvironment]
  );

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }
    const nextPosition = getMenuPosition(trigger, resolvedEnvironment);
    if (!nextPosition) {
      return;
    }
    setPosition(nextPosition);
  }, [resolvedEnvironment]);

  React.useLayoutEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return undefined;
    }

    setActiveIndex(selectedIndex);
    updatePosition();
    const focusHandle = resolvedEnvironment.requestFrame(() => {
      itemRefs.current[selectedIndex]?.focus({ preventScroll: true });
    });

    return () => resolvedEnvironment.cancelFrame(focusHandle);
  }, [isOpen, resolvedEnvironment, selectedIndex, updatePosition]);

  React.useEffect(() => {
    if (!isOpen || !documentObject || !windowObject) {
      return undefined;
    }

    const releaseNonSelectableDocument = retainSectionSelectDocumentSelectionLock(
      documentObject,
      environment
    );
    const releaseOpenInteractionHandlers = resolvedEnvironment.retainOpenInteractionHandlers({
      documentObject,
      isTargetInside: (target) => {
        const node = target as Node | null;
        return Boolean(
          node &&
          (triggerRef.current?.contains(node) || contentRef.current?.contains(node))
        );
      },
      onEscape: () => {
        setOpen(false);
        triggerRef.current?.focus({ preventScroll: true });
      },
      onOutsidePointerDown: () => {
        setOpen(false);
      },
      onWindowChange: updatePosition,
      windowObject
    });

    return () => {
      releaseNonSelectableDocument();
      releaseOpenInteractionHandlers();
    };
  }, [
    documentObject,
    environment,
    isOpen,
    resolvedEnvironment,
    setOpen,
    updatePosition,
    windowObject
  ]);

  const selectItem = React.useCallback(
    (item: SectionSelectItem<TValue>) => {
      onValueChange(item.value);
      setOpen(false);
      resolvedEnvironment.requestFrame(() => triggerRef.current?.focus({ preventScroll: true }));
    },
    [onValueChange, resolvedEnvironment, setOpen]
  );

  const focusItem = React.useCallback((nextIndex: number) => {
    const normalizedIndex = (nextIndex + items.length) % items.length;
    setActiveIndex(normalizedIndex);
    itemRefs.current[normalizedIndex]?.focus({ preventScroll: true });
  }, [items.length]);

  const handleTriggerKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setOpen(true);
        setActiveIndex(items.length - 1);
      }
    },
    [items.length, setOpen]
  );

  const handleItemKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (event.key === 'Escape' || event.key === 'Tab') {
        setOpen(false);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        focusItem(index + 1);
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        focusItem(index - 1);
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        focusItem(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        focusItem(items.length - 1);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectItem(items[index]);
      }
    },
    [focusItem, items, selectItem, setOpen]
  );

  const content =
    isOpen && position && documentObject?.body
      ? createPortal(
          <div
            ref={contentRef}
            id={contentId}
            role="listbox"
            aria-label={ariaLabel}
            data-slot="section-select-content"
            className={cn(
              'fixed z-[var(--onyx-z-popover)] select-none overflow-hidden rounded-[var(--onyx-radius-md)] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-menu)] p-1 text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-md)] backdrop-blur focus:outline-none',
              contentClassName
            )}
            onPointerDown={(event) => {
              preventPointerSelection(event, resolvedEnvironment, documentObject);
            }}
            onMouseDown={(event) => {
              preventPointerSelection(event, resolvedEnvironment, documentObject);
            }}
            style={{
              top: position.top,
              left: position.left,
              minWidth: position.minWidth,
              maxHeight: position.maxHeight
            }}
          >
            <div className="max-h-[inherit] overflow-y-auto">
              {items.map((item, index) => {
                const selected = item.value === value;
                const active = index === activeIndex;
                return (
                  <button
                    key={item.value}
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    data-slot="section-select-item"
                    data-active={active ? 'true' : undefined}
                    className={cn(
                      'relative flex w-full cursor-default select-none items-center gap-2 rounded-[var(--onyx-radius-sm)] py-2 pl-8 pr-2 text-left text-sm font-medium text-[var(--onyx-text-foreground)] outline-none transition-colors hover:bg-[var(--onyx-state-hover)] focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-state-selected-fg)] data-[active=true]:bg-[var(--onyx-state-selected)] data-[active=true]:text-[var(--onyx-state-selected-fg)]'
                    )}
                    onClick={() => selectItem(item)}
                    onFocus={() => setActiveIndex(index)}
                    onKeyDown={(event) => handleItemKeyDown(event, index)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {selected ? <Icon name="check" size="sm" /> : null}
                    </span>
                    <span
                      data-slot="section-select-item-leading"
                      className="flex h-4 w-4 shrink-0 items-center justify-center"
                    >
                      <Icon name={item.icon} size="sm" />
                    </span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          documentObject.body
        )
      : null;

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-controls={contentId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        data-slot="section-select-trigger"
        className={cn(
          'inline-flex h-auto w-auto min-h-0 select-none items-center justify-between gap-2 border-0 bg-transparent px-0 py-0 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--onyx-text-description)] whitespace-nowrap shadow-none hover:bg-transparent focus-visible:outline-none focus-visible:ring-0',
          triggerClassName
        )}
        onPointerDown={(event) => {
          preventPointerSelection(event, resolvedEnvironment, documentObject);
        }}
        onMouseDown={(event) => {
          preventPointerSelection(event, resolvedEnvironment, documentObject);
        }}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={valueId} className="leading-none">
          {selectedItem?.label ?? value}
        </span>
        <Icon name="chevron-down" size="sm" className="text-[var(--onyx-text-muted)]" />
      </button>
      {content}
    </>
  );
}
