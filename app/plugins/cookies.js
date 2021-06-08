const config = require('../config/server').cookieOptions
const { getCurrentPolicy, validSession, sessionIgnorePaths } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        if (!sessionIgnorePaths.find(path => request.path.startsWith(path)) && request.path !== '/') {
          if (!validSession(request)) {
            return h.redirect('session-timeout')
          }
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
