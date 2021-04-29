const scoreData = require('../../../data/score-data')

describe('Score page', () => {
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
  const createServer = require('../../../../app/server')
  const Wreck = require('@hapi/wreck')
  const senders = require('../../../../app/messaging/senders')
  const createMsg = require('../../../../app/messaging/create-msg')
  beforeEach(async () => {
    global.__SERVER__.stop()
    jest.mock('../../../../app/messaging')
    jest.mock('../../../../app/messaging/senders')
    jest.mock('ffc-messaging')
    senders.sendProjectDetails = jest.fn(async function (message, id) {
    })
    createMsg.getDesirabilityAnswers = jest.fn((request) => {
      return ''
    })
    server = await createServer()
    await server.start()
  })
  it('should load page with error score not received after polling scroing service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
    }
    const wreckResponse = {
      payload: null,
      res: {
        statusCode: 202
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

  it('should load page with error unhandled response from scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
    }
    const wreckResponse = {
      payload: null,
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

  it('should load page with error when wrong response from scoring service', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
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
      url: '/score'
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
      url: '/score'
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
  it('should load page with sucess High', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
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
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project has a high chance of getting funding.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('should load page with sucess Medium', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
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
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project has a medium chance of getting funding.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('should load page with sucess Low', async () => {
    jest.mock('@hapi/wreck')
    const options = {
      method: 'GET',
      url: '/score'
    }
    scoreData.desirability.overallRating.band = 'Low'
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
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const responseScoreMessage = 'This means your project has a low chance of getting funding.'
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('redirects to project business details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/score',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./next-steps')
  })

  afterEach(async () => {
    await server.stop()
  })
})
