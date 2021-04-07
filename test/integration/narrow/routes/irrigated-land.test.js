const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Irrigated Land page', () => {
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
      url: '/irrigated-land'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter land irrigated')
  })

  it('should returns error message if there is no data entered for \'currently irrigated land\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '5678', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter land irrigated')
  })

  it('should returns error message if there is no data entered for \'total irrigated land target\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '1234', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter land irrigated')
  })

  it('should store user response and redirects to water source page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '1234', irrigatedLandTarget: '5678', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigation-water-source')
  })

  afterEach(async () => {
    await server.stop()
  })
})
