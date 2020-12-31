const { Logger } = require('./lib')
const sentryDsn = process.env.SENTRY_DSN
const isDev = process.env.NODE_ENV === 'development'

module.exports = new Logger({
  appName: 'baciwa-api',
  raw: !isDev,
  ...(!isDev && { capture: true, sentryDsn })
})
