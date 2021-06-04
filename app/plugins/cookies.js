const config = require('../config/server').cookieOptions
const { getCurrentPolicy, validSession } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        // const pageUrl = request.url.pathname.split('/').pop()
        const pageUrl = request?.headers?.referer?.split('/').pop()
        if (!validSession(request) && pageUrl !== 'start' && pageUrl !== 'session-timeout') {
          return h.redirect('session-timeout')
        }

        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.context) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.context.cookiesPolicy = cookiesPolicy
        }

        return h.continue
      })
    }
  }
}
