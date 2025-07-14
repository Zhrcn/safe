/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  reactStrictMode: true,

  
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
        /Source Map URL:/,
        /i18next::translator: accessing an object - but returnObjects options is not enabled/,
        /Component Stack:/
      ];
      
      config.infrastructureLogging = {
        level: 'error',
        debug: false
      };

      config.devtool = 'eval-cheap-module-source-map';
    }
    return config;
  },

  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  experimental: {
    logging: {
      level: 'error'
    }
  }
};

export default nextConfig;