require('dotenv/config')

module.exports = {
  ui: false,
  files: 'demo/',
  server: 'demo/',
  logPrefix: 'controlled-components',
  port: process.env.PORT || 3000
}
