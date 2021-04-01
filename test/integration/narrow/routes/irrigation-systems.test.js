const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Irrigation syatems page', () => {
  process.env.COOKIE_PASSWORD = '1234567890123456789012345678901234567890'
  let crumCookie
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-systems'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message if no current water system option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-systems'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-systems',
      payload: { irrigationPlanned: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two options for each question')
  })

  it('should returns error message if no planned water system option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-systems'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-systems',
      payload: { irrigationCurrent: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two options for each question')
  })

  it('should store user response and redirects to productivity page', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-systems'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-systems',
      payload: { irrigationCurrent: 'some source 1', irrigationPlanned: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./productivity')
  })

  it('should display the error summary if more than two options are selected', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-systems'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-systems',
      payload: {
        irrigationCurrent: ['some option-1', 'some option-2', 'some option-3'],
        irrigationPlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumCookie[1]
      },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select the systems currently used to irrigate')
    expect(postResponse.payload).toContain('Select the systems that will be used to irrigate')
  })
  afterEach(async () => {
    await server.stop()
  })
})
