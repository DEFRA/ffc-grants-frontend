const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Abstraction licence page', () => {
  let crumCookie

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/abstraction-licence'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have an abstraction licence or variation')
  })

  it('if value = \'Expected to have by 31 December 2021\' ==> store and redirect to abstraction-caveat page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { abstractionLicence: 'Expected to have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./abstraction-caveat')
  })

  it('if value = \'Will not have by 31 December 2021\' ==> store and redirect to abstraction-caveat page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { abstractionLicence: 'Will not have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./abstraction-caveat')
  })

  it('if value = \'Not needed\' ==> store and redirect to SSSI page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { abstractionLicence: 'Not needed', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./SSSI')
  })

  it('if value = \'Secured\' ==> store and redirect to SSSI page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/abstraction-licence',
      payload: { abstractionLicence: 'Secured', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./SSSI')
  })
})
