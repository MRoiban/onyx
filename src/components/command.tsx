import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '../lib/cn';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog';
import { Icon } from './icon';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    data-slot="command"
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-[var(--onyx-radius-md)] bg-[var(--onyx-surface-menu)] text-[var(--onyx-text-foreground)]',
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandDialog = ({
  children,
  modal = false,
  ...props
}: React.ComponentProps<typeof Dialog>) => (
  <Dialog modal={modal} {...props}>
    <DialogContent className="max-w-xl border border-[var(--onyx-shell-tabs-border)] bg-[var(--onyx-surface-dialog)] p-0 text-[var(--onyx-text-foreground)] shadow-[var(--onyx-shadow-lg)] backdrop-blur [&_[cmdk-root]]:outline-none">
      <DialogTitle className="sr-only">Command Palette</DialogTitle>
      <DialogDescription className="sr-only">
        Search for commands and quick actions. Type to filter, Enter to run.
      </DialogDescription>
      <Command className="h-auto overflow-visible">{children}</Command>
    </DialogContent>
  </Dialog>
);

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div data-slot="command-input-shell" className="flex items-center border-b border-[var(--onyx-shell-tabs-border)] px-4">
    <Icon name="search" size="sm" className="text-[var(--onyx-text-description)]" />
    <CommandPrimitive.Input
      ref={ref}
      data-slot="command-input"
      className={cn(
        'flex h-12 w-full items-center bg-transparent py-3 pl-3 text-base text-[var(--onyx-text-foreground)] outline-none placeholder:text-[var(--onyx-text-description)]',
        className
      )}
      {...props}
    />
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    data-slot="command-list"
    className={cn('max-h-[420px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    data-slot="command-empty"
    className={cn('py-12 text-center text-sm text-[var(--onyx-text-description)]', className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    data-slot="command-group"
    className={cn(
      'overflow-hidden py-2 text-[var(--onyx-text-muted)] [&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest',
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    data-slot="command-separator"
    className={cn('mx-2 h-px bg-[var(--onyx-shell-tabs-border)]', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    data-slot="command-item"
    className={cn(
      'group flex w-full cursor-default select-none items-center gap-3 rounded-[var(--onyx-radius-sm)] px-4 py-2 text-sm text-[var(--onyx-text-foreground)] outline-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-40 aria-selected:bg-[var(--onyx-state-selected)] aria-selected:text-[var(--onyx-state-selected-fg)]',
      className
    )}
    {...props}
  >
    {children}
  </CommandPrimitive.Item>
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    data-slot="command-shortcut"
    className={cn(
      'ml-auto inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-[11px] font-medium uppercase text-[var(--onyx-text-description)]',
      className
    )}
    {...props}
  />
);
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
};
