const config = require('../../../app/config/polling')

describe('Polling Config Test', () => {
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
    const mockKey = 1234
    process.env.POLLING_INTERVAL = mockKey
    const pollingConfig = require('../../../app/config/polling')
    expect(pollingConfig.interval).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.POLLING_INTERVAL = null
    expect(() => require('../../../app/config/polling')).toThrow()
  })
})
