const { logException } = require('../services/app-insights')

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
