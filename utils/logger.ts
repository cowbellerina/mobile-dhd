/**
 * Centralized logging utility
 * Provides different log levels and can be configured for production
 */

const isDev = __DEV__;

export const logger = {
  /**
   * Debug level logging - only shown in development
   */
  debug: (...args: any[]) => {
    if (isDev) {
      console.log('[DEBUG]', ...args);
    }
  },

  /**
   * Info level logging - only shown in development
   */
  info: (...args: any[]) => {
    if (isDev) {
      console.info('[INFO]', ...args);
    }
  },

  /**
   * Warning level logging - shown in all environments
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },

  /**
   * Error level logging - shown in all environments
   * TODO: Integrate with error tracking service (Sentry, etc.)
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
    // Future: Send to error tracking service
    // if (!isDev) {
    //   Sentry.captureException(args[0]);
    // }
  },
};
