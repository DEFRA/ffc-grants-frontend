const appInsights = jest.mock('../../../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})

jest.mock('../../../../app/helpers/session', () => {
  const original = jest.requireActual('../../../../app/helpers/session')
  const varList = {
    'journey-start-time': (new Date()).getTime(),
    'current-score': 'some mock score'
  }
  return {
    ...original,
    setYarValue: (request, key, value) => null,
	  getYarValue: (request, key) => {
		if (Object.keys(varList).includes(key)) return varList[ key ]
		else return 'Error'
	}
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
    view: eventSuccess
  },
  route: {
    path: 'somePath'
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

  test('custom event CONFIRMATION sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'confirmation', pram: {} })
    expect(result).toBe(undefined)
  })

  test('custom event ELIGIBILITY PASSED sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'eligibility_passed', pram: {} })
    expect(result).toBe(undefined)
  })

  test('custom event CONFIRMATION sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'confirmation', pram: {} })
    expect(result).toBe(undefined)
  })

  test('custom event SCORE sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'score', pram: { score_presented: 'fake score' } })
    expect(result).toBe(undefined)
  })

  test('custom event ELIMINATION sent successfully', async () => {
    const result = await gapiService.sendGAEvent(request, { name: 'elimination', pram: {} })
    expect(result).toBe(undefined)
  })

  // test('Call sendEligibilityEvent throw error', async () => {
  //   const result = await gapiService.sendEligibilityEvent(requestError)
  //   expect(result).toBe(undefined)
  // })


  // test('Call processGA - no ga', async () => {
  //   const result = await gapiService.processGA(request)
  //   expect(result).toBe(undefined)
  // })

  // test('Call processGA - empty ga', async () => {
  //   const ga = []
  //   const result = await gapiService.processGA(request, ga)
  //   expect(result).toBe(undefined)
  // })

  // test('Call processGA - populated ga', async () => {
  //   const ga = [
  //     { journeyStart: 'mock-journey-start' },
  //     { dimension: 0 },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'yar',
  //         key: 'key-yar'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'custom',
  //         value: 'value-custom'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'score'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'confirmationId',
  //         key: 'value-confirmationId'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'journey-time'
  //       }
  //     },
  //     {
  //       dimension: 12,
  //       value: {
  //         type: 'mock-switch-default',
  //         value: 'value-mock-switch-default'
  //       }
  //     }
  //   ]

  //   const result = await gapiService.processGA(request, ga)
  //   expect(result).toBe(undefined)
  // })
})
