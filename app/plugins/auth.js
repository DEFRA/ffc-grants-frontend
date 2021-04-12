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
        validateFunc: (request, session) => session.authenticated
          ? { valid: true, credentials: authConfig.credentials }
          : { valid: false }
      })

      server.auth.default('session-auth')
    }
  }
}
