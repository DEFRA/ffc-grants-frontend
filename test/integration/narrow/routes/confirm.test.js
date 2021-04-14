const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Confirm page', () => {
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
      url: '/confirm'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
  it('should returns error message if not confirmed', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { iConfirm: false, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please confirm consent.')
  })
  it('should returns error message if null', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { iConfirm: null, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please confirm consent.')
  })
  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { crumb: crumbToken, iConfirm: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirmation')
  })

  afterEach(async () => {
    await server.stop()
  })
})
