const appInsights = require('applicationinsights')
const config = require('../config/server')

function setup () {
  if (config.appInsights && config.appInsights.key) {
    appInsights.setup().start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = config.appInsights.role
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  }
}
function logException (error, sessionId) {
  const client = appInsights.defaultClient
  client?.trackException({
    exception: error ?? new Error('unknown'),
    properties: {
      sessionId: sessionId || ''
    },
    metrics: { isFileUpload: true }
  })
}
module.exports = { setup, logException }
