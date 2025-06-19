"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

// Root components
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

// Submenu Trigger
const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-none transition-all duration-150 focus:bg-accent/80 focus:text-accent-foreground data-[state=open]:bg-accent/90 hover:bg-accent/60 active:bg-accent/70",
        inset && "pl-10",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2 flex h-5 w-5 items-center justify-center text-muted-foreground">{icon}</span>}
      {children}
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

// Submenu Content
const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-border !bg-white bg-opacity-100 !backdrop-blur-none dark:!bg-neutral-900 p-2 text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      style={{ backgroundColor: 'white', backgroundImage: 'none' }}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

// Main Dropdown Content
const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-border !bg-white bg-opacity-100 !backdrop-blur-none dark:!bg-neutral-900 text-popover-foreground shadow-2xl animate-in fade-in-80 p-2",
          className
        )}
        style={{ backgroundColor: 'white', backgroundImage: 'none' }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

// Menu Item
const DropdownMenuItem = React.forwardRef(
  ({ className, inset, icon, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-none transition-all duration-150 focus:bg-primary/90 focus:text-primary-foreground hover:bg-primary/80 active:bg-primary/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted/40 data-[disabled]:text-muted-foreground",
        inset && "pl-10",
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2 flex h-5 w-5 items-center justify-center text-muted-foreground">{icon}</span>}
      {children}
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

// Checkbox Item
const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl py-2 pl-10 pr-3 text-sm font-medium outline-none transition-all duration-150 focus:bg-accent/90 focus:text-accent-foreground hover:bg-accent/80 active:bg-accent/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted/40 data-[disabled]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/90 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {icon && <span className="mr-2 flex h-5 w-5 items-center justify-center text-muted-foreground">{icon}</span>}
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

// Radio Item
const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl py-2 pl-10 pr-3 text-sm font-medium outline-none transition-all duration-150 focus:bg-accent/90 focus:text-accent-foreground hover:bg-accent/80 active:bg-accent/70 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted/40 data-[disabled]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/90 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-2.5 w-2.5"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
          </span>
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {icon && <span className="mr-2 flex h-5 w-5 items-center justify-center text-muted-foreground">{icon}</span>}
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

// Label
const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80",
        inset && "pl-10",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

// Separator
const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-2 my-2 h-px bg-muted/60", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

// Shortcut (for keyboard hints)
const DropdownMenuShortcut = ({ className, ...props }) => (
  <span
    className={cn(
      "ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-mono tracking-widest text-muted-foreground/80 shadow-inner",
      className
    )}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

// Export all components in alphabetical order for clarity
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
}; 