const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Planning permission page', () => {
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
      url: '/planning-permission'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return an error message if no option is selected', async () => {
    const options = {
      method: 'GET',
      url: '/planning-permission'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have planning permission')
  })

  it('should store valid user input and redirect to project details page', async () => {
    const options = {
      method: 'GET',
      url: '/planning-permission'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { planningPermission: 'some fake permission', crumb: crumCookie[1] },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
