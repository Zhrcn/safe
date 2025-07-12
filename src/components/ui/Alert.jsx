"use client"

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next'

const alertVariants = cva(
  "relative w-full rounded-2xl border border-border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg]:-translate-y-1/2 [&>svg]:transform shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        danger: "bg-danger text-danger-foreground border-danger"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {props.children || t('alert.defaultTitle', 'Alert')}
    </h5>
  );
})
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription } 