module.exports = {
  locales: ['en', 'ar'],
  output: 'public/locales/$LOCALE/common.json',
  input: [
    'src/**/*.{js,jsx,ts,tsx}'
  ],
  defaultNamespace: 'common',
  keySeparator: false,
  namespaceSeparator: false,
  createOldCatalogs: false,
  sort: true,
  verbose: true,
}; 