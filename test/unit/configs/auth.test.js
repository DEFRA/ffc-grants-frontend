const config = require('../../../app/config/auth')

describe('get auth config', () => {
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
    process.env.AUTH_USERNAME = mockKey
    const authConfig = require('../../../app/config/auth')
    expect(authConfig.credentials.username).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.AUTH_USERNAME = null
    expect(() => require('../../../app/config/auth')).toThrow()
  })
})
