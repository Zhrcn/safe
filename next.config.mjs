/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: nextI18NextConfig.i18n.defaultLocale,
    locales: nextI18NextConfig.i18n.locales,
    localeDetection: false,
  },
  
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
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
        /Source Map URL:/
      ];
      
      config.infrastructureLogging = {
        level: 'error',
        debug: false
      };
    }
    return config;
  },
};

export default nextConfig;