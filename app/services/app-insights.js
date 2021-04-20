const appInsights = require('applicationinsights')
const config = require('../config/server')

function setup () {
  if (config.appInsights.keys | config.appInsights) {
    appInsights.setup().start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = config.appInsights.role
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  }
}

module.exports = { setup }
