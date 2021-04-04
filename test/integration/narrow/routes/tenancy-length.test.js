const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Water tenancy length page', () => {
  process.env.COOKIE_PASSWORD = '1234567890123456789012345678901234567890'
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
      url: '/tenancy-length'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy-length',
      payload: { crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the land has a tenancy agreement in place until 2026 or after')
  })

  it('should display info message when user selects "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy-length',
      payload: { tenancyLength: 'No', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You may be able to apply for a grant from this scheme')
  })

  it('should redirect to project items page when user selects "Yes"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy-length',
      payload: { tenancyLength: 'Yes', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-items')
  })

  afterEach(async () => {
    await server.stop()
  })
})
