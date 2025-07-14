'use client';
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAdvancedButton, useButtonWithLoading, useButtonWithConfirmation } from "@/hooks/useAdvancedButton";

const advancedButtonVariants = cva(
  "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5",
        secondary: "bg-secondary text-secondary-foreground border border-secondary/20 shadow-sm hover:bg-secondary/90 hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-secondary/50 hover:-translate-y-0.5",
        outline: "border-2 border-border bg-card text-card-foreground shadow-sm hover:bg-muted hover:border-primary hover:shadow-md hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5",
        ghost: "text-foreground hover:bg-muted hover:text-foreground hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5",
        destructive: "bg-error text-error-foreground shadow-lg hover:bg-error/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-error/50 hover:-translate-y-0.5",
        success: "bg-success text-success-foreground shadow-lg hover:bg-success/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-success/50 hover:-translate-y-0.5",
        warning: "bg-warning text-warning-foreground shadow-lg hover:bg-warning/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-warning/50 hover:-translate-y-0.5",
        info: "bg-accent text-accent-foreground shadow-lg hover:bg-accent/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-accent/50 hover:-translate-y-0.5",
        premium: "bg-gradient-to-r from-primary via-secondary to-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5 bg-[length:200%_100%] hover:bg-[length:100%_100%] transition-[background-size] duration-500",
        danger: "bg-error text-error-foreground shadow-lg hover:bg-error/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-error/50 hover:-translate-y-0.5",
        primary: "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg hover:bg-white/20 hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-white/50 hover:-translate-y-0.5",
        neon: "bg-transparent border-2 border-primary text-primary shadow-lg hover:shadow-primary/50 hover:shadow-2xl hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5",
        gradient: "bg-gradient-to-r from-primary via-secondary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-primary/50 hover:-translate-y-0.5 bg-[length:200%_100%] hover:bg-[length:100%_100%] transition-[background-size] duration-500",
        metallic: "bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 text-gray-800 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-gray-500/50 hover:-translate-y-0.5 border border-gray-300",
        holographic: "bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-purple-500/50 hover:-translate-y-0.5 bg-[length:200%_100%] hover:bg-[length:100%_100%] transition-[background-size] duration-500",
        cyber: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-cyan-500/50 hover:-translate-y-0.5 border border-cyan-300",
        organic: "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus-visible:ring-green-500/50 hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
      rounded: {
        default: "rounded-xl",
        full: "rounded-full",
        none: "rounded-none",
        sm: "rounded-lg",
        lg: "rounded-2xl",
      },
      animation: {
        none: "",
        bounce: "hover:animate-bounce",
        pulse: "hover:animate-pulse",
        spin: "hover:animate-spin",
        ping: "hover:animate-ping",
        float: "btn-float",
        glow: "btn-glow",
        shimmer: "btn-shimmer",
        "pulse-glow": "btn-pulse-glow",
        "bounce-gentle": "btn-bounce-gentle",
        "rotate-slow": "btn-rotate-slow",
      },
      effect: {
        none: "",
        lift: "btn-hover-lift",
        glow: "btn-hover-glow",
        shine: "btn-hover-shine",
        particles: "btn-particles",
        glass: "btn-glass",
        neon: "btn-neon",
        metallic: "btn-metallic",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      animation: "none",
      effect: "none",
    },
  }
);

const AdvancedButton = React.forwardRef(({ 
  className, 
  variant, 
  size, 
  rounded,
  animation,
  effect,
  asChild = false,
  children,
  icon,
  iconPosition = "left",
  loading = false,
  ripple = true,
  sound = false,
  hapticFeedback = false,
  analytics = false,
  debounceMs = 300,
  throttleMs = 1000,
  longPressDelay = 500,
  onLongPress,
  onPressStart,
  onPressEnd,
  confirmation = false,
  confirmationText = "Are you sure?",
  confirmationTimeout = 3000,
  onConfirm,
  onCancel,
  loadingText,
  asyncAction,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button";
  const [ripples, setRipples] = React.useState([]);
  const [isPressed, setIsPressed] = React.useState(false);

  const advancedButton = useAdvancedButton({
    hapticFeedback,
    analytics,
    debounceMs,
    throttleMs,
    longPressDelay,
    onLongPress,
    onPressStart,
    onPressEnd,
  });

  const { isLoading, loadingText: hookLoadingText, withLoading } = useButtonWithLoading({
    loadingText,
  });

  const confirmationHook = useButtonWithConfirmation({
    confirmationText,
    confirmationTimeout,
    onConfirm,
    onCancel,
  });

  const isButtonLoading = loading || isLoading;

  const createRipple = (event) => {
    if (!ripple) return;
    
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      x,
      y,
      size,
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    if (sound) {
      console.log('Button click sound');
    }
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  const handleMouseDown = (event) => {
    setIsPressed(true);
    createRipple(event);
    advancedButton.handlePressStart(event);
  };

  const handleMouseUp = (event) => {
    setIsPressed(false);
    advancedButton.handlePressEnd(event);
  };

  const handleMouseLeave = (event) => {
    setIsPressed(false);
    advancedButton.handleMouseLeave(event);
  };

  const handleClick = async (event) => {
    if (confirmation) {
      confirmationHook.handleClick(event);
      return;
    }

    if (asyncAction) {
      await withLoading(asyncAction, loadingText);
      return;
    }

    advancedButton.handleDebouncedClick(event, props.onClick);
  };

  React.useEffect(() => {
    return () => {
      advancedButton.cleanup();
      confirmationHook.cleanup();
    };
  }, [advancedButton, confirmationHook]);

  const getButtonText = () => {
    if (isButtonLoading) {
      return hookLoadingText || loadingText || 'Loading...';
    }
    if (confirmation && confirmationHook.needsConfirmation) {
      return confirmationText;
    }
    return children;
  };

  return (
    <Comp
      className={cn(advancedButtonVariants({ variant, size, rounded, animation, effect, className }))}
      ref={ref}
      disabled={isButtonLoading || props.disabled}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={advancedButton.onTouchStart}
      onTouchEnd={advancedButton.onTouchEnd}
      onClick={handleClick}
      {...props}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {isButtonLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center"
        >
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      )}
      
      {!isButtonLoading && icon && iconPosition === "left" && (
        <motion.span 
          className="mr-2"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}
      
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: isButtonLoading ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {getButtonText()}
      </motion.span>
      
      {!isButtonLoading && icon && iconPosition === "right" && (
        <motion.span 
          className="ml-2"
          whileHover={{ scale: 1.1, rotate: -5 }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.span>
      )}

      {isPressed && (
        <motion.div
          className="absolute inset-0 bg-black/10 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        />
      )}

      {advancedButton.isLongPressed && (
        <motion.div
          className="absolute inset-0 bg-primary/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      {confirmation && confirmationHook.needsConfirmation && (
        <motion.div
          className="absolute inset-0 bg-warning/20 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Comp>
  );
});

AdvancedButton.displayName = "AdvancedButton";

export { AdvancedButton, advancedButtonVariants };
export default AdvancedButton; 