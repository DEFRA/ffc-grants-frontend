beforeEach(async () => {
  // ...
  // Set reference to server in order to close the server during teardown.
  const createServer = require('../app/server')
  const mockSession = {
    getCurrentPolicy: (request, h) => true,
    createDefaultPolicy: (h) => true,
    updatePolicy: (request, h, analytics) => null,
    validSession: (request) => global.__VALIDSESSION__ ?? true,
    sessionIgnorePaths: []
  }

  jest.mock('../app/cookies/index', () => mockSession)
  jest.mock('../app/services/gapi-service.js')
  jest.mock('../app/services/app-insights.js')
  jest.mock('../app/services/protective-monitoring-service.js')
  jest.mock('../app/config/auth', () => {
    return {
      credentials: {
        username: '',
        passwordHash: ''
      },
      cookie: {
        name: 'session-auth',
        password: '',
        isSecure: false
      },
      enabled: false
    }
  })

  const server = await createServer()
  global.__SERVER__ = server
  global.__VALIDSESSION__ = true
  global.__URLPREFIX__ = require('../app/config/server').urlPrefix
})
