const appInsights = jest.mock('../../../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})

jest.mock('../../../../app/helpers/session', () => {
  const original = jest.requireActual('../../../../app/helpers/session')
  return {
    ...original,
    setYarValue: jest.fn((a, b, c) => {})
  }
})

jest.mock('../../../../app/services/protective-monitoring-service', () => {
  const original = jest.requireActual('../../../../app/services/protective-monitoring-service')
  return {
    ...original,
    sendMonitoringEvent: jest.fn().mockResolvedValue(undefined)
  }
})

const gapiService = require('../../../../app/services/gapi-service')

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
  yar: {
    id: 'Some ID',
    get: jest.fn()
  }
}

const requestError = {
  ga: {
    event: eventError
  },
  yar: {
    id: 'Some ID',
    get: jest.fn()
  }
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
    let result = await gapiService.sendEligibilityEvent(request)
    expect(result).toBe(undefined)

    result = await gapiService.sendEligibilityEvent(request, false)
    expect(result).toBe(undefined)
  })

  test('Call sendEvent throw error', async () => {
    let result = await gapiService.sendEvent(requestError, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)

    result = await gapiService.sendEvent({}, 'CATEGORY', 'ACTION')
    expect(result).toBe(undefined)
  })

  test('Call sendDimensionOrMetric throw error', async () => {
    const result = await gapiService.sendDimensionOrMetric(requestError, { dimensionOrMetric: 'cd1', value: 'some value' })
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

  test('Call sendJourneyTime', async () => {
    const result = await gapiService.sendJourneyTime(request, '')
    expect(result).toBe(undefined)
  })

  test('Call processGA - no ga', async () => {
    const result = await gapiService.processGA(request)
    expect(result).toBe(undefined)
  })

  test('Call processGA - empty ga', async () => {
    const ga = []
    const result = await gapiService.processGA(request, ga)
    expect(result).toBe(undefined)
  })

  test('Call processGA - populated ga', async () => {
    const ga = [
      { journeyStart: 'mock-journey-start' },
      { dimension: 0 },
      {
        dimension: 12,
        value: {
          type: 'yar',
          key: 'key-yar'
        }
      },
      {
        dimension: 12,
        value: {
          type: 'custom',
          value: 'value-custom'
        }
      },
      {
        dimension: 12,
        value: {
          type: 'score'
        }
      },
      {
        dimension: 12,
        value: {
          type: 'confirmationId',
          key: 'value-confirmationId'
        }
      },
      {
        dimension: 12,
        value: {
          type: 'journey-time'
        }
      },
      {
        dimension: 12,
        value: {
          type: 'mock-switch-default',
          value: 'value-mock-switch-default'
        }
      }
    ]

    const result = await gapiService.processGA(request, ga)
    expect(result).toBe(undefined)
  })
})
