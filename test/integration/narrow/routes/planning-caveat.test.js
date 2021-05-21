const { getCookieHeader, getCrumbCookie } = require('./test-helper')

describe('Planning caveat page', () => {
  let crumCookie

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/planning-caveat'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })
})
