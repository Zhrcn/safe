import * as React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/utils/styles';

export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  delayDuration = 300,
  className,
  style,
  ...props
}) {

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            sideOffset={10}
            className={cn(
              'z-50 rounded-xl px-4 py-2 text-sm font-medium shadow-xl border',
              'bg-[color:var(--color-card)] text-[color:var(--color-card-foreground)] border-[color:var(--color-border)]',
              'backdrop-blur-md bg-opacity-90',
              'animate-in fade-in-80',
              'data-[state=delayed-open]:data-[side=top]:slide-in-from-bottom-2',
              'data-[state=delayed-open]:data-[side=bottom]:slide-in-from-top-2',
              'data-[state=delayed-open]:data-[side=left]:slide-in-from-right-2',
              'data-[state=delayed-open]:data-[side=right]:slide-in-from-left-2',
              className
            )}
            style={{
              ...style,
              borderColor: 'var(--color-border, #E0E0E0)',
              background: 'var(--color-card, #fff)',
              color: 'var(--color-card-foreground, #1A202C)',
            }}
            {...props}
          >
            <span className="flex items-center gap-2">
              {content}
            </span>
            <RadixTooltip.Arrow
              className="fill-[color:var(--color-card)] drop-shadow"
              style={{
                fill: 'var(--color-card, #fff)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.08))'
              }}
            />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}