const config = require('../../../app/config/cache')

describe('cache Config Test', () => {
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
    process.env.REDIS_HOSTNAME = mockKey
    const cacheConfig = require('../../../app/config/cache')
    expect(cacheConfig.catboxOptions.host).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.REDIS_HOSTNAME = null
    expect(() => require('../../../app/config/cache')).toThrow()
  })
})
