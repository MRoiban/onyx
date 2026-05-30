import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../lib/cn';

export const statusBarItemVariants = cva(
  'inline-flex min-h-7 items-center gap-2 rounded-[var(--onyx-radius-sm)] px-2 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'text-[var(--onyx-shell-status-bar-fg)] hover:bg-[var(--onyx-state-hover)]',
        active: 'bg-[var(--onyx-state-active)] text-[var(--onyx-shell-status-bar-fg)]',
        warning: 'text-[var(--onyx-state-warning)] hover:bg-[var(--onyx-state-hover)]',
        error: 'text-[var(--onyx-state-error)] hover:bg-[var(--onyx-state-hover)]',
        success: 'text-[var(--onyx-state-success)] hover:bg-[var(--onyx-state-hover)]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export const StatusBar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <footer
      ref={ref}
      data-slot="status-bar"
      className={cn(
        'flex min-h-8 items-center gap-1 bg-[var(--onyx-shell-status-bar-bg)] px-2 text-[var(--onyx-shell-status-bar-fg)]',
        className
      )}
      {...props}
    />
  )
);
StatusBar.displayName = 'StatusBar';

export interface StatusBarItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBarItemVariants> {}

export const StatusBarItem = React.forwardRef<HTMLDivElement, StatusBarItemProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="status-bar-item"
      className={cn(statusBarItemVariants({ variant }), className)}
      {...props}
    />
  )
);
StatusBarItem.displayName = 'StatusBarItem';

export const StatusBarSpacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="status-bar-spacer" className={cn('flex-1', className)} {...props} />
  )
);
StatusBarSpacer.displayName = 'StatusBarSpacer';
