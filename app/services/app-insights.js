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
function logException (request, event) {
  try {
    const client = appInsights.defaultClient
    client?.trackException({
      exception: event.error ?? new Error('unknown'),
      properties: {
        statusCode: request ? request.statusCode : '',
        sessionId: request ? request.yar.id : '',
        payload: request ? request.payload : '',
        request: event.request ?? 'Server Error'
      }
    })
  } catch (err) {
    console.log(err)
  }
}
module.exports = { setup, logException }
