const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Water tenancy page', () => {
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
      url: '/tenancy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message in body if no option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/tenancy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: { crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the farm business owns')
  })

  it('should redirect to tenancy length page when user selects "No"', async () => {
    const options = {
      method: 'GET',
      url: '/tenancy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: { landOwnership: 'No', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./tenancy-length')
  })

  it('should redirect to project items page when user selects "Yes"', async () => {
    const options = {
      method: 'GET',
      url: '/tenancy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: { landOwnership: 'Yes', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
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
