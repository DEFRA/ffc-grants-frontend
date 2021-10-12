const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')

describe('cookies route', () => {
  let crumCookie
  it('GET /cookies context includes Header', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cookies`
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response._payload._data).toContain('Cookies')
    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  it('should redirect to start page when session valid', async () => {
    global.__VALIDSESSION__ = false
    const options = {
      method: 'GET',
      url: '/project-summary',
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/farmer-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/water/start')
  })

  it('POST /cookies returns 302 if not async', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
  })

  it('GET /cookies returns cookie policy', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cookies`
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.request.response.variety).toBe('view')
    expect(result.request.response.source.template).toBe('cookies/cookie-policy')
    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })

  it('POST /cookies returns 200 if async', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { crumb: crumbToken, analytics: true, async: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)
  })

  it('POST /cookies invalid returns 400', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { crumb: crumbToken, invalid: 'aaaaaa' },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(400)
  })

  it('GET /cookies returns 200', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/cookies`
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(200)

    const header = getCookieHeader(result)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(result)
    expect(result.result).toContain(crumCookie[1])
  })
  it('POST /cookies redirects to GET with querystring', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/cookies`,
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const result = await global.__SERVER__.inject(options)
    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe(`${global.__URLPREFIX__}/cookies?updated=true`)
  })
})
