const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Planning permission page', () => {
  let crumCookie

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/planning-permission'
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
      url: '/planning-permission',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have planning permission')
  })

  it('if value = \'Will not have by 31 December 2021\' ==> disqualify user', async () => {
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { planningPermission: 'Will not have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('if value = \'Expected to have by 31 December 2021\' ==> store and redirect to planning-caveat page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { planningPermission: 'Expected to have by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./planning-caveat')
  })

  it('if value = \'Not needed\' ==> store and redirect to abstraction licence page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { planningPermission: 'Not needed', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./abstraction-licence')
  })

  it('if value = \'Secured\' ==> store and redirect to abstraction licence page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/planning-permission',
      payload: { planningPermission: 'Secured', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./abstraction-licence')
  })
})
