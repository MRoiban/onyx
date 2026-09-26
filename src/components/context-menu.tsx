import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

import { cn } from '../lib/cn';
import { Icon } from './icon';

export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuGroup = ContextMenuPrimitive.Group;
export const ContextMenuPortal = ContextMenuPrimitive.Portal;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

export const ContextMenuSubTrigger = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean;
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    data-slot="context-menu-sub-trigger"
    className={cn(
      'group flex cursor-default select-none items-center rounded-[4px] px-3 py-[5px] text-sm leading-5 text-[var(--onyx-text-foreground)] outline-none transition-colors focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-state-selected-fg)] data-[state=open]:bg-[var(--onyx-state-selected)] data-[state=open]:text-[var(--onyx-state-selected-fg)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      inset && 'pl-8',
      className
    )}
    {...props}
  >
    {children}
    <Icon
      name="chevron-right"
      size="sm"
      className="ml-6 text-[var(--onyx-text-muted)] group-focus:text-[var(--onyx-state-selected-fg)] group-data-[state=open]:text-[var(--onyx-state-selected-fg)]"
    />
  </ContextMenuPrimitive.SubTrigger>
));
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

export const ContextMenuSubContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.SubContent>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.SubContent
      ref={ref}
      data-slot="context-menu-sub-content"
      className={cn(
        'z-[var(--onyx-z-popover)] min-w-[252px] overflow-hidden rounded-[6px] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-menu)] p-1 text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-md)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

export const ContextMenuContent = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      data-slot="context-menu-content"
      className={cn(
        'z-[var(--onyx-z-popover)] min-w-[252px] overflow-hidden rounded-[6px] border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-menu)] p-1 text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-md)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
));
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

export const ContextMenuItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    data-slot="context-menu-item"
    className={cn(
      'group relative flex cursor-default select-none items-center gap-0 rounded-[4px] px-3 py-[5px] text-sm leading-5 text-[var(--onyx-text-foreground)] outline-none transition-colors focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-state-selected-fg)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

export const ContextMenuCheckboxItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ checked, children, className, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    data-slot="context-menu-checkbox-item"
    checked={checked}
    className={cn(
      'group relative flex cursor-default select-none items-center rounded-[var(--onyx-radius-sm)] py-1.5 pl-8 pr-2 text-sm text-[var(--onyx-text-foreground)] outline-none transition-colors focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-state-selected-fg)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Icon name="check" size="sm" className="text-[var(--onyx-state-selected-fg)]" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
));
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

export const ContextMenuRadioItem = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    data-slot="context-menu-radio-item"
    className={cn(
      'group relative flex cursor-default select-none items-center rounded-[var(--onyx-radius-sm)] py-1.5 pl-8 pr-2 text-sm text-[var(--onyx-text-foreground)] outline-none transition-colors focus:bg-[var(--onyx-state-selected)] focus:text-[var(--onyx-state-selected-fg)] data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        <Icon name="primitive-dot" size="sm" className="text-[var(--onyx-state-selected-fg)]" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
));
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

export const ContextMenuLabel = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Label>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean;
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    data-slot="context-menu-label"
    className={cn(
      'px-3 pb-1 pt-2 text-xs font-semibold text-[var(--onyx-text-description)]',
      inset && 'pl-8',
      className
    )}
    {...props}
  />
));
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

export const ContextMenuSeparator = forwardRef<
  ElementRef<typeof ContextMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    data-slot="context-menu-separator"
    className={cn('mx-3 my-1 h-px bg-[var(--onyx-shell-tabs-border)]', className)}
    {...props}
  />
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

export const ContextMenuShortcut = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'span'>) => (
  <span
    data-slot="context-menu-shortcut"
    className={cn('ml-auto text-xs text-[var(--onyx-text-description)]', className)}
    {...props}
  />
);
ContextMenuShortcut.displayName = 'ContextMenuShortcut';
