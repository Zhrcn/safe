import path from 'path';
const nextI18NextConfig = {
  i18n: {
    defaultLocale: 'ar',
    locales: ['ar', 'en'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  localePath: typeof window === 'undefined'
    ? path.resolve('./public/locales')
    : '/locales',
};

export default nextI18NextConfig; 