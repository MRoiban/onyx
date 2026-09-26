import * as React from 'react';

import { cn } from '../lib/cn';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd
    ref={ref}
    data-slot="kbd"
    className={cn(
      'inline-flex min-h-[20px] items-center justify-center rounded-[var(--onyx-radius-sm)] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-panel)] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-[var(--onyx-text-muted)] shadow-[inset_0_-1px_0_rgba(16,15,15,0.25)]',
      className
    )}
    {...props}
  />
));
Kbd.displayName = 'Kbd';
