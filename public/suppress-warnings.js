(function() {
  'use strict';
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    
    const originalError = console.error;
    const originalWarn = console.warn;
    
    function shouldSuppress(message) {
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
      return false;
    }
    
    function shouldSuppressArgs(args) {
      return args.some(arg => {
        if (typeof arg === 'string') {
          return shouldSuppress(arg);
        }
        return false;
      });
    }
    
    console.error = function(...args) {
      if (!shouldSuppressArgs(args)) {
        originalError.apply(console, args);
      }
    };
    
    console.warn = function(...args) {
      if (!shouldSuppressArgs(args)) {
        originalWarn.apply(console, args);
      }
    };
    
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const errorElements = node.querySelectorAll('.console-error, .console-warning');
              errorElements.forEach(function(element) {
                const text = element.textContent || '';
                if (shouldSuppress(text)) {
                  element.style.display = 'none';
                }
              });
            }
          });
        }
      });
    });
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, { childList: true, subtree: true });
      });
    } else {
      observer.observe(document.body, { childList: true, subtree: true });
    }
  }
})(); 