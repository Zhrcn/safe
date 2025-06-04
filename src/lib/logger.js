/**
 * Logging service for consistent logging throughout the application
 * Supports different log levels and contextual information
 */

const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Default to INFO in production, DEBUG in development
const currentLogLevel = process.env.LOG_LEVEL 
  ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] 
  : (process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG);

/**
 * Creates a logger instance for a specific module
 * @param {string} module - The module name for context
 * @returns {Object} Logger object with error, warn, info, and debug methods
 */
export function logger(module) {
  return {
    error: (message, ...args) => {
      if (currentLogLevel >= LOG_LEVELS.ERROR) {
        console.error(`[ERROR][${module}] ${message}`, ...args);
      }
    },
    warn: (message, ...args) => {
      if (currentLogLevel >= LOG_LEVELS.WARN) {
        console.warn(`[WARN][${module}] ${message}`, ...args);
      }
    },
    info: (message, ...args) => {
      if (currentLogLevel >= LOG_LEVELS.INFO) {
        console.info(`[INFO][${module}] ${message}`, ...args);
      }
    },
    debug: (message, ...args) => {
      if (currentLogLevel >= LOG_LEVELS.DEBUG) {
        console.debug(`[DEBUG][${module}] ${message}`, ...args);
      }
    },
    // Add timing functions for performance monitoring
    time: (label) => {
      if (currentLogLevel >= LOG_LEVELS.DEBUG) {
        console.time(`[${module}] ${label}`);
      }
    },
    timeEnd: (label) => {
      if (currentLogLevel >= LOG_LEVELS.DEBUG) {
        console.timeEnd(`[${module}] ${label}`);
      }
    }
  };
}

// Create a default logger
export const defaultLogger = logger('App');
