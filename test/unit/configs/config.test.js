const config = require('../../../app/config/server')

describe('get config', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })
  test('Should pass validation for all fields populated', async () => {
    expect(config).toBeDefined()
  })
  test('Valid env var pass validation', () => {
    const mockKey = 'mock-key'
    process.env.COOKIE_PASSWORD = mockKey
    const serverConfig = require('../../../app/config/server')
    expect(serverConfig.cookiePassword).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.COOKIE_PASSWORD = null
    expect(() => require('../../../app/config/server')).toThrow()
  })
})
