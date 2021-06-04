const config = require('../config/server').cookieOptions
const { getCurrentPolicy } = require('../cookies')

module.exports = {
  plugin: {
    name: 'cookies',
    register: (server, options) => {
      server.state('cookies_policy', config)

      server.ext('onPreResponse', (request, h) => {
        if (!request.state.session) {
          console.log('Oh no, the session cookie no longer exists, it must have timed out')
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
