const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Collaboration page', () => {
  process.env.COOKIE_PASSWORD = '1234567890123456789012345678901234567890'
  let server
  const createServer = require('../../../../app/server')
  let crumCookie

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/collaboration'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/collaboration',
      payload: { collaboration: null, crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  it('should store user response and redirects to answers page', async () => {
    const options = {
      method: 'GET',
      url: '/collaboration'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/collaboration',
      payload: { crumb: crumCookie[1], collaboration: 'some fake data' },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./answers')
  })

  afterEach(async () => {
    await server.stop()
  })
})
