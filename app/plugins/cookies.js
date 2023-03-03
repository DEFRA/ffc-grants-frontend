const { cookieOptions, urlPrefix, surveyLink } = require('../config/server')
const { getCurrentPolicy, validSession, sessionIgnorePaths } = require('../cookies')
const cacheConfig = require('../config/cache')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', cookieOptions)

      server.ext('onPreResponse', (request, h) => {
        let showTimeout = false
        if (!sessionIgnorePaths.find(path => request.path.startsWith(path)) && request.path !== '/') {
          showTimeout = true
          if (!validSession(request) && server.table().filter(route => request.path.toLowerCase() === route.path.toLowerCase()).length > 0) {
            return h.redirect('session-timeout')
          }
        }
        const statusCode = request.response.statusCode
        if (request.response.variety === 'view' && statusCode !== 404 && statusCode !== 500 && request.response.source.manager._context) {
          const cookiesPolicy = getCurrentPolicy(request, h)
          request.response.source.manager._context.cookiesPolicy = cookiesPolicy
          request.response.source.manager._context.showTimeout = showTimeout
          request.response.source.manager._context.sessionTimeoutInMin = (cacheConfig.expiresIn / 60000) - 5
          request.response.source.manager._context.surveyLink = surveyLink
        }

        return h.continue
      })
    }
  }
}
