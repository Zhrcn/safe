/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  reactStrictMode: true,
  // Remove i18n config from here since we're using react-i18next
  // i18n: {
  //   defaultLocale: nextI18NextConfig.i18n.defaultLocale,
  //   locales: nextI18NextConfig.i18n.locales,
  //   localeDetection: false,
  // },
  
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Ignore source map warnings and errors
      config.ignoreWarnings = [
        /Failed to parse source map/,
        /Can't resolve .*\.map/,
        /installHook\.js\.map/,
        /react_devtools_backend_compact\.js\.map/,
        /Source map error/,
        /request failed with status 404/,
        /can't access property 'sources'/,
        /map is undefined/,
        /%3Canonymous%20code%3E/,
        /Resource URL:/,
        /Source Map URL:/,
        /i18next::translator: accessing an object - but returnObjects options is not enabled/,
        /Component Stack:/
      ];
      
      // Reduce infrastructure logging noise
      config.infrastructureLogging = {
        level: 'error',
        debug: false
      };

      // Disable source maps for development to reduce noise
      config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },

  // Suppress console warnings in development
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },

  // Experimental features
  experimental: {
    // Reduce console noise
    logging: {
      level: 'error'
    }
  }
};

export default nextConfig;