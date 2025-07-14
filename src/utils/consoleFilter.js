if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

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

  console.error = (...args) => {
    const message = args[0];
    
    if (
      typeof message === 'string' && (
        message.includes('Source map error') ||
        message.includes('request failed with status 404') ||
        message.includes('installHook.js.map') ||
        message.includes('react_devtools_backend_compact.js.map') ||
        message.includes('%3Canonymous%20code%3E') ||
        message.includes('Resource URL:') ||
        message.includes('Source Map URL:')
      )
    ) {
      return;
    }
    
    originalConsoleError.apply(console, args);
  };

  console.warn = (...args) => {
    const message = args[0];
    
    if (
      typeof message === 'string' && (
        message.includes('i18next::translator: accessing an object - but returnObjects options is not enabled') ||
        message.includes('Source map error') ||
        message.includes('request failed with status 404') ||
        message.includes('installHook.js.map') ||
        message.includes('react_devtools_backend_compact.js.map') ||
        message.includes('%3Canonymous%20code%3E') ||
        message.includes('Resource URL:') ||
        message.includes('Source Map URL:') ||
        message.includes('Component Stack:')
      )
    ) {
      return;
    }
    
    originalConsoleWarn.apply(console, args);
  };
}

export default {}; 