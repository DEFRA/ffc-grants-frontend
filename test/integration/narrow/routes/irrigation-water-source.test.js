const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Irrigation water source page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
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
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message if no current water source option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourcePlanned: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two options for each question')
  })

  it('should returns error message if no planned water source option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourceCurrent: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two options for each question')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourceCurrent: 'some source 1', waterSourcePlanned: 'some souce 2', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigation-systems')
  })

  it('should display the error summary if more than two options are selected for each question', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2', 'some option-3'],
        waterSourcePlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumCookie[1]
      },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select where your current irrigation water comes from')
    expect(postResponse.payload).toContain('Select where your current irrigation water comes from')
  })
  afterEach(async () => {
    await server.stop()
  })
})
