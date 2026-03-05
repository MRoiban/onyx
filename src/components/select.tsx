import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';

import { cn } from '../lib/cn';
import { Icon } from './icon';

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    data-slot="select-trigger"
    className={cn(
      'flex h-9 w-full items-center justify-between gap-2 rounded-[var(--onyx-radius-md)] border border-[var(--onyx-control-input-border)] bg-[var(--onyx-control-input-bg)] px-3 py-2 text-sm text-[var(--onyx-control-input-fg)] shadow-[var(--onyx-shadow-sm)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--onyx-control-focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <Icon name="chevron-down" size="sm" className="text-[var(--onyx-text-muted)]" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      data-slot="select-content"
      className={cn(
        'z-[var(--onyx-z-popover)] min-w-[8rem] overflow-hidden rounded-[var(--onyx-radius-md)] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-menu)] text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-md)] backdrop-blur focus:outline-none',
        position === 'popper' && 'translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        data-slot="select-viewport"
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]'
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    data-slot="select-label"
    className={cn(
      'py-1.5 pl-8 pr-2 text-xs font-semibold uppercase tracking-wide text-[var(--onyx-text-description)]',
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-[var(--onyx-radius-sm)] py-1.5 pl-8 pr-2 text-sm text-[var(--onyx-text-foreground)] outline-none transition-colors focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-text-inverse)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Icon name="check" size="sm" className="text-[var(--onyx-text-inverse)]" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    data-slot="select-separator"
    className={cn('my-1 h-px bg-[var(--onyx-shell-tabs-border)]', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator
};
