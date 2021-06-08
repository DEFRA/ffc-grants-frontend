/*
* Add an `onPreResponse` listener to return error pages
*/
const appInsights = require('../services/app-insights')

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            return h.view('404').code(statusCode).takeover()
          }
          const err = {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          }
          console.error('error', err)
          appInsights.defaultClient?.trackException(new Error(JSON.stringify(err)))

          if (statusCode === 400) {
            return h.view('400').code(statusCode).takeover()
          }
          // The return the `500` view
          return h.view('500').code(statusCode).takeover()
        }
        return h.continue
      })
    }
  }
}
