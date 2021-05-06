
const appInsight = require('../../../../../app/services/app-insights')

describe('get appInsight setup defined', () => {
  test('Should be defined', () => {
    expect(appInsight).toBeDefined()
  })
  test('With now key Should not to throw', () => {
    expect(appInsight.setup()).toBe(undefined)
  })
  test('logException should run', () => {
    expect(appInsight.logException(new Error(''), '12341234')).toBe(undefined)
  })
  test('logException should not throw error', () => {
    expect(appInsight.logException(null, null)).toBe(undefined)
  })
})
