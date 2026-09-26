import { type KeyboardEvent, type ReactNode, forwardRef, useEffect, useRef, useState } from 'react';

import { cn } from '../lib/cn';

/**
 * Zed-style prompt (crates/ui_prompt): a compact, title-less card with a
 * message, an optional muted detail, and full-width stacked actions. The first
 * action starts active; arrows/Tab cycle, Enter picks the active action, and
 * Escape picks the action labelled "Cancel" (or does nothing when there is
 * none, so the prompt cannot be dismissed without an answer).
 */
export interface PromptProps {
  message: string;
  detail?: string | null;
  actions: readonly string[];
  onRespond: (actionIndex: number) => void;
  /** Label Escape resolves to. Defaults to "Cancel". */
  cancelLabel?: string;
  className?: string;
}

export function resolvePromptCancelIndex(actions: readonly string[], cancelLabel = 'Cancel'): number {
  return actions.indexOf(cancelLabel);
}

export function stepPromptActionIndex(current: number, count: number, direction: 1 | -1): number {
  if (count <= 0) {
    return 0;
  }
  return (current + direction + count) % count;
}

/** Renders `code` spans and line breaks, the only markdown Zed prompts use. */
export function renderPromptText(text: string): ReactNode[] {
  return text.split('\n').flatMap((line, lineIndex) => {
    const segments = line.split('`').map((segment, segmentIndex) =>
      segmentIndex % 2 === 1 ? (
        <code key={`${lineIndex}-${segmentIndex}`} data-slot="prompt-code">
          {segment}
        </code>
      ) : (
        segment
      )
    );
    return lineIndex === 0 ? segments : [<br key={`br-${lineIndex}`} />, ...segments];
  });
}

export const Prompt = forwardRef<HTMLDivElement, PromptProps>(
  ({ actions, cancelLabel = 'Cancel', className, detail, message, onRespond }, ref) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

    useEffect(() => {
      setActiveIndex(0);
    }, [actions, message]);

    useEffect(() => {
      buttonRefs.current[activeIndex]?.focus();
    }, [activeIndex, actions, message]);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      const step = (direction: 1 | -1) => {
        event.preventDefault();
        setActiveIndex((current) => stepPromptActionIndex(current, actions.length, direction));
      };

      switch (event.key) {
        case 'ArrowDown':
          return step(1);
        case 'ArrowUp':
          return step(-1);
        case 'Tab':
          return step(event.shiftKey ? -1 : 1);
        case 'Home':
          event.preventDefault();
          return setActiveIndex(0);
        case 'End':
          event.preventDefault();
          return setActiveIndex(Math.max(0, actions.length - 1));
        case 'Enter':
          event.preventDefault();
          event.stopPropagation();
          return onRespond(activeIndex);
        case 'Escape': {
          event.preventDefault();
          event.stopPropagation();
          const cancelIndex = resolvePromptCancelIndex(actions, cancelLabel);
          if (cancelIndex >= 0) {
            onRespond(cancelIndex);
          }
          return;
        }
        default:
          return;
      }
    };

    return (
      <div
        ref={ref}
        role="alertdialog"
        aria-modal="true"
        aria-label={message}
        data-slot="prompt"
        className={cn(
          'flex w-80 max-w-[calc(100vw-32px)] cursor-default flex-col gap-4 overflow-hidden rounded-[var(--onyx-radius-lg)] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-dialog)] p-4 text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-lg)]',
          '[&_[data-slot=prompt-code]]:rounded-[3px] [&_[data-slot=prompt-code]]:bg-[var(--onyx-state-hover)] [&_[data-slot=prompt-code]]:px-1 [&_[data-slot=prompt-code]]:font-mono',
          className
        )}
        onKeyDown={handleKeyDown}
      >
        <p data-slot="prompt-message" className="m-0 break-words">
          {renderPromptText(message)}
        </p>
        {detail ? (
          <p data-slot="prompt-detail" className="m-0 break-words text-xs text-[var(--onyx-text-description)]">
            {renderPromptText(detail)}
          </p>
        ) : null}
        <div data-slot="prompt-actions" className="flex flex-col gap-1">
          {actions.map((action, index) => {
            const active = index === activeIndex;
            return (
              <button
                key={`${index}-${action}`}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                type="button"
                data-slot="prompt-action"
                data-active={active ? 'true' : undefined}
                tabIndex={active ? 0 : -1}
                className={cn(
                  'flex h-[22px] w-full items-center justify-center rounded-[var(--onyx-radius-sm)] border px-2 text-[length:inherit] leading-none outline-none transition-colors',
                  active
                    ? 'border-[color-mix(in_srgb,var(--onyx-control-focus-ring)_50%,transparent)] bg-[color-mix(in_srgb,var(--onyx-control-focus-ring)_16%,transparent)] text-[var(--onyx-text-foreground)]'
                    : 'border-[var(--onyx-shell-tabs-border)] bg-transparent text-[var(--onyx-text-foreground)] hover:bg-[var(--onyx-state-hover)]'
                )}
                onClick={() => onRespond(index)}
              >
                {action}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);
Prompt.displayName = 'Prompt';
