import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"
import { useTranslation } from 'react-i18next';

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-32 h-32",
};

// Helper to resolve image URL from backend or relative path
export const getImageUrl = (src) => {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src; // absolute URL
  if (src.startsWith('/uploads/')) return src; // already correct public path
  // fallback: treat as profile image filename
  return `/uploads/profile/${src}`;
};

const Avatar = React.forwardRef(({ src, alt, children, size = "md", className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative overflow-hidden rounded-full bg-muted flex items-center justify-center",
      sizeMap[size],
      className
    )}
    {...props}
  >
    {src ? (
      <AvatarPrimitive.Image
        src={getImageUrl(src)}
        alt={alt || "Avatar"}
        className="absolute inset-0 w-full h-full object-cover rounded-full"
      />
    ) : (
      children
    )}
  </AvatarPrimitive.Root>
))
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
    <Avatar src={src} alt="Profile Picture" size={size} className={className}>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

export { Avatar, AvatarImage, AvatarFallback } 