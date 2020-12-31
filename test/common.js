const { host, port } = require('../config').app

const appUrl = `${host}:${port}`
const testUsername = process.env.TEST_USERNAME
const testPassword = process.env.TEST_PASSWORD
const fingerprint = '12345678901234567890'

module.exports = {
  appUrl,
  testUsername,
  testPassword,
  fingerprint
}
