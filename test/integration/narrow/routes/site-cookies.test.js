const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('cookies route', () => {
  let createServer
  let server
  let crumCookie
  beforeEach(async () => {
    createServer = require('../../../../app/server')
    server = await createServer()
    await server.initialize()
  })

  afterEach(async () => {
    await server.stop()
  })

  test('GET /site-cookies context includes Header', async () => {
    const options = {
      method: 'GET',
      url: '/site-cookies'
    }

    const result = await server.inject(options)
    expect(result.request.response._payload._data).toContain('Cookies')
    const header = getCookieHeader(result)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  test('POST /site-cookies returns 302 if not async', async () => {
    const options = {
      method: 'POST',
      url: '/site-cookies',
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(302)
  })

  test('GET /site-cookies returns cookie policy', async () => {
    const options = {
      method: 'GET',
      url: '/site-cookies'
    }

    const result = await server.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('cookies/cookie-policy')
    const header = getCookieHeader(result)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  test('POST /site-cookies returns 200 if async', async () => {
    const options = {
      method: 'POST',
      url: '/site-cookies',
      payload: { crumb: crumbToken, analytics: true, async: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /site-cookies invalid returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/site-cookies',
      payload: { crumb: crumbToken, invalid: 'aaaaaa' },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /site-cookies returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/site-cookies'
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(200)

    const header = getCookieHeader(result)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })
  test('POST /site-cookies redirects to GET with querystring', async () => {
    const options = {
      method: 'POST',
      url: '/site-cookies',
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await server.inject(options)
    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe('/site-cookies?updated=true')
  })
})
