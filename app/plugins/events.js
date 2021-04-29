const appInsights = require('applicationinsights')
const client = appInsights.defaultClient
function logException (request, event) {
  client.trackException({
    exception: event.error ?? new Error('unknownn'),
    properties: {
      statusCode: request ? request.statusCode : '',
      sessionId: request ? request.yar.id : '',
      payload: request ? request.payload : '',
      request: event.request ?? 'Server Error'
    }
  })
}
module.exports = {
  plugin: {
    name: 'events',
    register: (server, options) => {
      server.events.on('request', (request, event, tags) => {
        if (tags.error) {
          logException(request, event)
          console.error(`Request ${event.request} error: ${event.error ? event.error.message : 'unknown'}`)
        }
      })
      server.events.on('log', (event, tags) => {
        if (tags.error) {
          logException(event)
          console.error(`Server error: ${event.error ? event.error.message : 'unknown'}`)
        }
      })
    }
  }
}
