const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('cookies route', () => {
  let crumCookie
  test('GET /cookies context includes Header', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response._payload._data).toContain('Cookies')
    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  test('POST /cookies returns 302 if not async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
  })

  test('GET /cookies returns cookie policy', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('cookies/cookie-policy')
    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  test('POST /cookies returns 200 if async', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { crumb: crumbToken, analytics: true, async: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)
  })

  test('POST /cookies invalid returns 400', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { crumb: crumbToken, invalid: 'aaaaaa' },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(400)
  })

  test('GET /cookies returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/cookies'
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)

    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })
  test('POST /cookies redirects to GET with querystring', async () => {
    const options = {
      method: 'POST',
      url: '/cookies',
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe('./cookies?updated=true')
  })
})
