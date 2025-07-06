// Console filter to suppress source map warnings in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  // Filter out source map related warnings
  const shouldSuppress = (message) => {
    if (typeof message === 'string') {
      return message.includes('Source map error') ||
             message.includes('installHook.js.map') ||
             message.includes('react_devtools_backend_compact.js.map') ||
             message.includes('Failed to parse source map') ||
             message.includes("can't access property 'sources'") ||
             message.includes('request failed with status 404') ||
             message.includes('Source Map URL:') ||
             message.includes('Resource URL:') ||
             message.includes('%3Canonymous%20code%3E') ||
             message.includes('map is undefined');
    }
    
    // Also check if any of the arguments contain these strings
    if (Array.isArray(message)) {
      return message.some(arg => 
        typeof arg === 'string' && (
          arg.includes('Source map error') ||
          arg.includes('installHook.js.map') ||
          arg.includes('react_devtools_backend_compact.js.map') ||
          arg.includes('Failed to parse source map') ||
          arg.includes("can't access property 'sources'") ||
          arg.includes('request failed with status 404') ||
          arg.includes('Source Map URL:') ||
          arg.includes('Resource URL:') ||
          arg.includes('%3Canonymous%20code%3E') ||
          arg.includes('map is undefined')
        )
      );
    }
    
    return false;
  };

  // Override console.error
  console.error = (...args) => {
    if (!shouldSuppress(args)) {
      originalConsoleError.apply(console, args);
    }
  };

  // Override console.warn
  console.warn = (...args) => {
    if (!shouldSuppress(args)) {
      originalConsoleWarn.apply(console, args);
    }
  };
}

export default {}; 