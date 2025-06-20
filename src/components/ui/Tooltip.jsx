import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/utils/styles';

export function Tooltip({ content, children, side = 'top', align = 'center', delayDuration = 300, ...props }) {
  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            className={cn(
              'z-50 rounded-md bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-lg animate-in fade-in-80',
              'data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-2',
              'data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-2',
              'data-[state=delayed-open]:data-[side=left]:slide-in-from-right-2',
              'data-[state=delayed-open]:data-[side=right]:slide-in-from-left-2'
            )}
            sideOffset={8}
            {...props}
          >
            {content}
            <RadixTooltip.Arrow className="fill-popover" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
} 