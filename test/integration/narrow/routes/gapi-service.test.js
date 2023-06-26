const appInsights = jest.mock('../../../../app/services/app-insights')
appInsights.logException = jest.fn((req, event) => {
  return null
})
const serviceName = 'Water Management'
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
  return 'ok'
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



describe('get gapiService setup', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('Should be defined', () => {
    expect(gapiService).toBeDefined()
  })

  test('custom event CONFIRMATION sent successfully', async () => {
    expect.assertions(5)
    const result = await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.CONFIRMATION, pram: {} })
    expect(result).toBe(undefined)
    expect(eventSuccess).toHaveBeenCalledTimes(1)
    expect(eventSuccess).toHaveBeenCalledWith(
      request,
      [
        {
          name: "confirmation",
          params: {
            confirmation_time: expect.any(String),
            final_score: "some mock score",
            grant_type: serviceName,
            page_path: "somePath",
            user_type: expect.any(String)
          }
        }
      ]
    )
    expect(eventError).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
  })

  test('custom event SCORE sent successfully', async () => {
    expect.assertions(5)
    const result = await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.SCORE, pram: { score_presented: 'fake score' } })
    expect(result).toBe(undefined)
    expect(eventSuccess).toHaveBeenCalledTimes(1)
    expect(eventSuccess).toHaveBeenCalledWith(
      request,
      [
        {
          name: "score",
          params: {
            grant_type: serviceName,
            page_path: "somePath",
            score_time: expect.anything() // Neat! No one man should have all that power!
          }
        }
      ]
    )
    expect(eventError).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
  })

  test('custom event ELIMINATION sent successfully', async () => {
    expect.assertions(5)
    const result = await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.ELIMINATION, pram: {} })
    expect(result).toBe(undefined)
    expect(eventSuccess).toHaveBeenCalledTimes(1)
    expect(eventSuccess).toHaveBeenCalledWith(
      request,
      [
        {
          name: "elimination",
          params: {
            grant_type: serviceName,
            page_path: "somePath",
            elimination_time: expect.any(String) // it's better to use a type matcher for random strings, I used .everything() before purely for fun!
          }
        }
      ]
    )
    expect(eventError).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
  })

  test('custom event ELIGIBILITY PASSED sent successfully', async () => {
    expect.assertions(5)
    const result = await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.ELIGIBILITY, pram: {} })
    expect(result).toBe(undefined)
    expect(eventSuccess).toHaveBeenCalledTimes(1)
    expect(eventSuccess).toHaveBeenCalledWith(
      request,
      [
        {
          name: "eligibility_passed",
          params: {
            grant_type: serviceName,
            page_path: "somePath",
            eligibility_time: expect.any(String),
          }
        }
      ]
    )
    expect(eventError).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
  })

  test('custom event PAGEVIEW PASSED sent successfully', async () => {
    expect.assertions(5)
    const result = await gapiService.sendGAEvent(request, { name: gapiService.eventTypes.PAGEVIEW, pram: {} })
    expect(result).toBe(undefined)
    expect(eventSuccess).toHaveBeenCalledTimes(1)
    expect(eventSuccess).toHaveBeenCalledWith(
      request,
      [
        {
          name: "pageview",
          params: {
            grant_type: serviceName,
            page_path: "somePath",
          }
        }
      ]
    )
    expect(eventError).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
  })

  test('test isBlockDefaultPageView() -> false', () => {
    const result = gapiService.isBlockDefaultPageView({ pathname: '/water/country' })
    expect(result).toBe(false)
  })

  test('test isBlockDefaultPageView()-> true', () => {
    const result = gapiService.isBlockDefaultPageView({ pathname: '/water/applying' })
    expect(result).toBe(true)
  })

  test('eventTypes', () => {
    Object.keys(gapiService.eventTypes).forEach((eventKey) => {
      expect(gapiService.eventTypes[ eventKey ]).toBeDefined() // and that's a valid use of toBeDefined()!
      expect(gapiService.eventTypes[ eventKey ]).toEqual(expect.any(String))
    })
  })
})
