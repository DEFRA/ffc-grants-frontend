const cookie = require('@hapi/cookie')
const authConfig = require('../config/auth')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server, options) => {
      await server.register(cookie)

      server.auth.strategy('session-auth', 'cookie', {
        cookie: authConfig.cookie,
        redirectTo: '/login',
        validateFunc: async (request, session) => {
          if (session.authenticated) {
            return { valid: true, credentials: authConfig.credentials }
          }

          return { valid: false }
        }
      })

      if (authConfig.enabled) {
        server.auth.default('session-auth')
      }
    }
  }
}
