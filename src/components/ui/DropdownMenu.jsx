"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Trigger
      ref={ref}
      className={cn(className, '!text-white')}
      {...props}
    >
      {children}
    </DropdownMenuPrimitive.Trigger>
  )
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const darkBg = "dark:bg-[#181c23]";
const darkText = "dark:text-white";
const darkBorder = "dark:border-primary/30";
const darkHover = "dark:hover:bg-[#232a36]/80";
const transition = "transition-all duration-200";
const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-none",
        "bg-white text-black border border-border shadow-md hover:bg-muted/70 focus:bg-muted/80",
        darkBg, darkText, darkBorder, darkHover, transition,
        "focus:ring-2 focus:ring-primary/40 focus:z-10",
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

const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-border bg-white text-black p-2 shadow-2xl",
        darkBg, darkText, darkBorder, transition,
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[10rem] overflow-hidden rounded-2xl border border-border bg-white text-black p-2 shadow-2xl",
          darkBg, darkText, darkBorder, transition,
          "animate-in fade-in-80",
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = React.forwardRef(
  ({ className, inset, icon, logo = false, children, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium outline-none border border-transparent",
        "bg-white text-black hover:bg-muted/70 focus:bg-muted/80",
        darkBg, darkText, darkBorder, darkHover, transition,
        "focus:ring-2 focus:ring-primary/40 focus:z-10",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
        inset && "pl-10",
        className
      )}
      {...props}
    >
      {logo && (
        <Image
          src="/logo(1).png"
          alt="Logo"
          width={20}
          height={20}
          className="mr-2 grayscale contrast-200 brightness-0"
          style={{ filter: 'grayscale(1) brightness(0) invert(0)' }}
        />
      )}
      {icon && <span className="mr-2 flex h-5 w-5 items-center justify-center text-muted-foreground">{icon}</span>}
      {children}
    </DropdownMenuPrimitive.Item>
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl py-2 pl-10 pr-3 text-sm font-medium outline-none transition-all duration-150",
        "bg-popover text-popover-foreground",
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 active:bg-accent/90",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="flex h-5 w-5 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
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

const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, icon, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center gap-2 rounded-2xl py-2 pl-10 pr-3 text-sm font-medium outline-none transition-all duration-150",
        "bg-popover text-popover-foreground", 
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent/80 active:bg-accent/90",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[disabled]:bg-muted data-[disabled]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="absolute left-3 flex h-5 w-5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <span className="flex h-4 w-4 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
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

const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground",
        "bg-popover", 
        inset && "pl-10",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";


const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-2 my-2 h-px bg-muted", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuShortcut = ({ className, ...props }) => (
  <span
    className={cn(
      "ml-auto rounded-2xl bg-muted px-2 py-0.5 text-xs font-mono tracking-widest text-muted-foreground shadow-inner",
      className
    )}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

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