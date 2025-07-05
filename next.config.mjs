/** @type {import('next').NextConfig} */
import nextI18NextConfig from './next-i18next.config.mjs';

const nextConfig = {
  reactStrictMode: true,
  // Only use static export in production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
  // i18n configuration (works in development, disabled in production export)
  ...(process.env.NODE_ENV !== 'production' && {
    i18n: {
      defaultLocale: nextI18NextConfig.i18n.defaultLocale,
      locales: nextI18NextConfig.i18n.locales,
      localeDetection: false,
    },
  }),
};

export default nextConfig;