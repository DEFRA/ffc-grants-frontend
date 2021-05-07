const config = require('../../../app/config/messaging')

describe('Messaging Config Test', () => {
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
    process.env.SERVICE_BUS_HOST = mockKey
    const messagingConfig = require('../../../app/config/messaging')
    expect(messagingConfig.projectDetailsQueue.host).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.SERVICE_BUS_HOST = null
    expect(() => require('../../../app/config/messaging')).toThrow()
  })
})
