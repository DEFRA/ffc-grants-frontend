beforeEach(async () => {
  // ...
  // Set reference to server in order to close the server during teardown.
  const createServer = require('../app/server')
  jest.mock('../app/services/gapi-service.js')
  jest.mock('../app/services/app-insights.js')
  jest.mock('../app/services/protective-monitoring-service.js')
  jest.mock('../app/cookies/index', () => ({
    getCurrentPolicy: (request, h) => true,
    createDefaultPolicy: (h) => true,
    updatePolicy: (request, h, analytics) => null,
    validSession: (request) => {
      return true
    }
  }))
  const server = await createServer()
  global.__SERVER__ = server
})
