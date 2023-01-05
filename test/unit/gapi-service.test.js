const appInsights = jest.mock('../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})
const gapiService = require('../../app/services/gapi-service')
const eventSuccess = jest.fn(async (obj) => {
  return null
})
const eventError = jest.fn(async (obj) => {
  throw new Error('Some error')
})

const request = {
  ga: {
    event: eventSuccess
  },
  yar: { id: 'Some ID' }
}

const requestError = {
  ga: {
    event: eventError
  },
  yar: { id: 'Some ID' }
}
afterEach(() => {
  jest.resetAllMocks()
})
describe('get gapiService setup', () => {
  test('Should be defined', () => {
    expect(gapiService).toBeDefined()
  })
  test('Call sendEvent successfully', async () => {
    const result = await gapiService.sendEvent(request, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)
  })
  test('Call sendDimensionOrMetric successfully', async () => {
    const result = await gapiService.sendDimensionOrMetric(request, { dimensionOrMetric: 'cd1', value: 'some value' })
    expect(result).toBe(undefined)
  })
  test('Call sendEligibilityEvent successfully', async () => {
    const result = await gapiService.sendEligibilityEvent(request)
    expect(result).toBe(undefined)
  })
  test('Call sendEvent throw error', async () => {
    const result = await gapiService.sendEvent(requestError, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)
  })
  test('Call sendDimensionOrMetric throw error', async () => {
    const result = await gapiService.sendDimensionOrMetric(requestError, { dimensionOrMetric: 'cd1', value: 'some value' })
    expect(result).toBe(undefined)
  })
  test('Call sendEligibilityEvent throw error', async () => {
    const result = await gapiService.sendEligibilityEvent(requestError)
    expect(result).toBe(undefined)
  })
  test('Call sendDimensionOrMetrics', async () => {
    const items = [
      { dimensionOrMetric: 'cd1', value: 'some value' },
      { dimensionOrMetric: 'cd2', value: 'TIME' }
    ]
    const result = await gapiService.sendDimensionOrMetrics(request, items)
    expect(result).toBe(undefined)
  })
  test('Call sendEligibilityEvent throw error', async () => {
    const result = await gapiService.sendEligibilityEvent(requestError)
    expect(result).toBe(undefined)
  })
})
