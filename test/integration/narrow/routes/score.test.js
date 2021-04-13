const scoreData = require('../../../data/score-data')

describe('Score page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie } = require('./test-helper')
  const createServer = require('../../../../app/server')
  const Wreck = require('@hapi/wreck')

  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('ffc-messaging')
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
  it('should load page with sucess', async () => {
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
    const responseScoreMessage = `This means your project has a high chance of getting funding.`
    expect(response.payload).toContain(responseScoreMessage)
  })
  it('redirects to project business details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/score',
      payload: { crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./business-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
