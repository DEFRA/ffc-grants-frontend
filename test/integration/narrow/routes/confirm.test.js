const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Confirm page', () => {
  let crumCookie

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/confirm'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return error message if main confirm checkbox (the first) is not selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please confirm you are happy to be contacted about your application.')
  })

  it('should return error message if null', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please confirm you are happy to be contacted about your application.')
  })

  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { consentMain: 'CONSENT_MAIN', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirmation')
  })
})
