const appInsight = require('../../app/services/app-insights')

describe('get appInsight setup', () => {
  test('Should be defined', () => {
    expect(appInsight).toBeDefined()
  })
  test('With now key Should not to throw', () => {
    expect(appInsight.setup()).toBe(undefined)
  })
  test('logException should run', () => {
    const req = { statusCode: 200, yar: { id: '1234' }, payload: {} }
    const event = { error: 'Some error.', request: req }
    expect(appInsight.logException(req, event)).toBe(undefined)
  })
  test('logException should not throw error', () => {
    expect(appInsight.logException(null, null)).toBe(undefined)
  })
})
