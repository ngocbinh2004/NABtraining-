const path = require('path')

module.exports = {
  i18n: {
    locales: ['en', 'cn'],
    defaultLocale: 'cn',
    localeDetection: false,
  },
  localePath:
    typeof window === 'undefined'
      ? path.resolve('./public/locales')
      : '/public/locales',
  defaultNS: ['langs'],
}
