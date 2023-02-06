const scoreData = require('../../../data/score-data')
const varList = {
  collaboration: 'wer',
  'current-score': 'wer'
}

// jest.mock('../../../../app/messaging/application')
// const { getWaterScoring } = require('../../../../app/messaging/application')

jest.mock('../../../../app/helpers/session', () => ({
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return 'Error'
  }
}))

describe('Score page', () => {
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
  const createServer = require('../../../../app/server')
  const Wreck = require('@hapi/wreck')
  const newSender = require('../../../../app/messaging/application')
  const createMsg = require('../../../../app/messaging/create-msg')
  const getDesirabilityAnswersSpy = jest.spyOn(createMsg, 'getDesirabilityAnswers').mockImplementation(() => {
    return '';
  })
  const getWaterScoringSpy = jest.spyOn(newSender, 'getWaterScoring').mockImplementation(() => {
    return scoreData;
  }) 

  beforeEach(async () => {
    global.__SERVER__.stop()
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')

    server = await createServer()
    await server.start()
  })
  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  it('should load page with error unhandled response from scoring service', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with error when wrong response from scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    const wreckResponse = {
      payload: { desirability: null },
      res: {
        statusCode: 500
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error when can\'t connect scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    Wreck.get = jest.fn(async function (url, type) {
      throw new Error('can\'t reach')
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with error getScore return null', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    Wreck.get = jest.fn(async function (url, type) {
      return null
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should load page with success Strong', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    const wreckResponse = {
      payload: scoreData,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project is likely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getWaterScoringSpy).toHaveBeenCalledTimes(1)
  })
  it('should load page with success Average', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    scoreData.desirability.overallRating.band = 'Average'
    const wreckResponse = {
      payload: scoreData,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project might be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getWaterScoringSpy).toHaveBeenCalledTimes(1)
  })
  it('should load page with sucess Weak', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    scoreData.desirability.overallRating.band = 'Weak'
    const wreckResponse = {
      payload: scoreData,
      res: {
        statusCode: 200
      }
    }
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project is unlikely to be successful.'
    expect(response.payload).toContain(responseScoreMessage)
    expect(getDesirabilityAnswersSpy).toHaveBeenCalledTimes(1)
    expect(getWaterScoringSpy).toHaveBeenCalledTimes(1)
  })
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    scoreData.desirability.overallRating.band = 'Weak'
    const wreckResponse = {
      payload: scoreData,
      res: {
        statusCode: 200
      }
    }

    jest.spyOn(newSender, 'getWaterScoring').mockImplementationOnce(() => { throw new Error('error')})
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    
  })

  it('should load page if scoring null', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }
    scoreData.desirability.overallRating.band = 'Weak'
    const wreckResponse = {
      payload: scoreData,
      res: {
        statusCode: 200
      }
    }

    jest.spyOn(newSender, 'getWaterScoring').mockImplementationOnce(() => { return null })
    Wreck.get = jest.fn(async function (url, type) {
      return wreckResponse
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

  })

  it('redirects to project business details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/score`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/business-details`)
  })

  it('redirects to start if no current score or collaboration', async () => {
    varList['current-score'] = null
    varList.collaboration = null

    const postOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/score`
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/start`)
  })

  afterEach(async () => {
    await server.stop()
  })
})
