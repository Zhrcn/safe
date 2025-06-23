'use client';
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-tr from-primary to-blue-600 text-white hover:from-blue-600 hover:to-primary/90 active:scale-95 shadow-md hover:shadow-lg",
        destructive: "bg-gradient-to-tr from-destructive to-red-600 text-white hover:from-red-600 hover:to-destructive/90 active:scale-95 shadow-md hover:shadow-lg",
        outline: "border border-border bg-background hover:bg-muted hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-11 py-2.5 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, logo = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "!text-white" 
        )}
        ref={ref}
        {...props}
      >
        {!asChild && logo && (
          <Image
            src="/logo(1).png"
            alt="Logo"
            width={22}
            height={22}
            className="mr-2 grayscale contrast-200 brightness-0"
            style={{ filter: 'grayscale(1) brightness(0) invert(0)' }}
          />
        )}
        {!asChild && props.children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export default Button; 