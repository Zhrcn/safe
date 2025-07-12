import { useState, useCallback, useRef } from 'react';

export const useAdvancedButton = (options = {}) => {
  const {
    hapticFeedback = false,
    analytics = false,
    debounceMs = 300,
    throttleMs = 1000,
    onPressStart,
    onPressEnd,
    onLongPress,
    longPressDelay = 500,
    ...rest
  } = options;

  const [isPressed, setIsPressed] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const [pressStartTime, setPressStartTime] = useState(null);
  const longPressTimerRef = useRef(null);
  const lastClickTimeRef = useRef(0);
  const throttleTimerRef = useRef(null);

  // Haptic feedback function
  const triggerHapticFeedback = useCallback(() => {
    if (!hapticFeedback || !navigator.vibrate) return;
    
    try {
      navigator.vibrate(50); // Short vibration
    } catch (error) {
      console.warn('Haptic feedback not supported:', error);
    }
  }, [hapticFeedback]);

  // Analytics tracking function
  const trackButtonClick = useCallback((event, buttonData = {}) => {
    if (!analytics) return;
    
    try {
      // You can integrate with your analytics service here
      const clickData = {
        timestamp: Date.now(),
        element: event.target,
        buttonData,
        userAgent: navigator.userAgent,
        ...rest
      };
      
      console.log('Button click tracked:', clickData);
      
      // Example: Send to analytics service
      // analytics.track('button_click', clickData);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, [analytics, rest]);

  // Debounced click handler
  const handleDebouncedClick = useCallback((event, handler) => {
    const now = Date.now();
    if (now - lastClickTimeRef.current < debounceMs) {
      return;
    }
    lastClickTimeRef.current = now;
    
    triggerHapticFeedback();
    trackButtonClick(event);
    handler?.(event);
  }, [debounceMs, triggerHapticFeedback, trackButtonClick]);

  // Throttled click handler
  const handleThrottledClick = useCallback((event, handler) => {
    if (throttleTimerRef.current) {
      return;
    }
    
    throttleTimerRef.current = setTimeout(() => {
      throttleTimerRef.current = null;
    }, throttleMs);
    
    triggerHapticFeedback();
    trackButtonClick(event);
    handler?.(event);
  }, [throttleMs, triggerHapticFeedback, trackButtonClick]);

  // Press start handler
  const handlePressStart = useCallback((event) => {
    setIsPressed(true);
    setPressStartTime(Date.now());
    
    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPressed(true);
      onLongPress?.(event);
    }, longPressDelay);
    
    onPressStart?.(event);
  }, [longPressDelay, onLongPress, onPressStart]);

  // Press end handler
  const handlePressEnd = useCallback((event) => {
    setIsPressed(false);
    setIsLongPressed(false);
    setPressStartTime(null);
    
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    onPressEnd?.(event);
  }, [onPressEnd]);

  // Mouse leave handler
  const handleMouseLeave = useCallback((event) => {
    handlePressEnd(event);
  }, [handlePressEnd]);

  // Touch end handler
  const handleTouchEnd = useCallback((event) => {
    handlePressEnd(event);
  }, [handlePressEnd]);

  // Get press duration
  const getPressDuration = useCallback(() => {
    if (!pressStartTime) return 0;
    return Date.now() - pressStartTime;
  }, [pressStartTime]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
    }
  }, []);

  return {
    // State
    isPressed,
    isLongPressed,
    pressStartTime,
    pressDuration: getPressDuration(),
    
    // Handlers
    handlePressStart,
    handlePressEnd,
    handleMouseLeave,
    handleTouchEnd,
    handleDebouncedClick,
    handleThrottledClick,
    
    // Utilities
    triggerHapticFeedback,
    trackButtonClick,
    cleanup,
    
    // Event handlers for direct use
    onMouseDown: handlePressStart,
    onMouseUp: handlePressEnd,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handlePressStart,
    onTouchEnd: handleTouchEnd,
  };
};

// Hook for button with loading state
export const useButtonWithLoading = (options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  
  const startLoading = useCallback((text = 'Loading...') => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);
  
  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('');
  }, []);
  
  const withLoading = useCallback(async (asyncFunction, loadingText = 'Loading...') => {
    startLoading(loadingText);
    try {
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);
  
  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading,
  };
};

// Hook for button with confirmation
export const useButtonWithConfirmation = (options = {}) => {
  const {
    confirmationText = 'Are you sure?',
    confirmationTimeout = 3000,
    onConfirm,
    onCancel,
  } = options;
  
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const confirmationTimerRef = useRef(null);
  
  const handleClick = useCallback((event) => {
    if (needsConfirmation) {
      // Second click - confirm
      setNeedsConfirmation(false);
      if (confirmationTimerRef.current) {
        clearTimeout(confirmationTimerRef.current);
      }
      onConfirm?.(event);
    } else {
      // First click - show confirmation
      setNeedsConfirmation(true);
      confirmationTimerRef.current = setTimeout(() => {
        setNeedsConfirmation(false);
        onCancel?.();
      }, confirmationTimeout);
    }
  }, [needsConfirmation, confirmationTimeout, onConfirm, onCancel]);
  
  const cancelConfirmation = useCallback(() => {
    setNeedsConfirmation(false);
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
    }
    onCancel?.();
  }, [onCancel]);
  
  // Cleanup
  const cleanup = useCallback(() => {
    if (confirmationTimerRef.current) {
      clearTimeout(confirmationTimerRef.current);
    }
  }, []);
  
  return {
    needsConfirmation,
    confirmationText,
    handleClick,
    cancelConfirmation,
    cleanup,
  };
};

// Hook for button with keyboard shortcuts
export const useButtonWithShortcut = (shortcut, options = {}) => {
  const {
    onShortcut,
    preventDefault = true,
    ...rest
  } = options;
  
  const handleKeyDown = useCallback((event) => {
    const isShortcut = 
      (shortcut.ctrl && event.ctrlKey) &&
      (shortcut.shift && event.shiftKey) &&
      (shortcut.alt && event.altKey) &&
      (shortcut.meta && event.metaKey) &&
      event.key.toLowerCase() === shortcut.key.toLowerCase();
    
    if (isShortcut) {
      if (preventDefault) {
        event.preventDefault();
      }
      onShortcut?.(event);
    }
  }, [shortcut, onShortcut, preventDefault]);
  
  return {
    onKeyDown: handleKeyDown,
    ...rest,
  };
};

export default useAdvancedButton; 