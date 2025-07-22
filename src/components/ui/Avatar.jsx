import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next';

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-32 h-32",
};

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const getImageUrl = (src) => {
  if (!src || typeof src !== 'string' || !src.trim()) return undefined;
  if (/^https?:\/\//.test(src)) return src; // already absolute
  return `${BACKEND_URL}${src}`;
};

const Avatar = React.forwardRef(({ size = "md", className, children, ...props }, ref) => {
  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-full bg-muted flex items-center justify-center",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
})
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef(({ className, children, ...props }, ref) => {
  const { t } = useTranslation();
  return (
    <span
      ref={ref}
      className={cn(
        "w-full h-full flex items-center justify-center rounded-full text-2xl font-semibold bg-primary/10 text-primary",
        className
      )}
      {...props}
    >
      {children || t('avatar.fallback', 'User')}
    </span>
  );
})
AvatarFallback.displayName = "AvatarFallback"

// Helper for profile pages
export function PatientProfileAvatar({ src, firstName, lastName, size = "lg", className }) {
  const initials =
    (firstName || lastName)
      ? `${firstName ? firstName.charAt(0) : ""}${lastName ? lastName.charAt(0) : ""}`
      : null;
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={src} alt="Profile Picture" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

// Helper to get initials from first and last name or a full name string
export function getInitials(firstName, lastName) {
  if (firstName || lastName) {
    return `${firstName ? firstName.charAt(0) : ''}${lastName ? lastName.charAt(0) : ''}`.toUpperCase();
  }
  return '';
}

export function getInitialsFromName(name) {
  if (!name) return '';
  const safeName = String(name);
  const parts = safeName.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export { Avatar, AvatarImage, AvatarFallback } 