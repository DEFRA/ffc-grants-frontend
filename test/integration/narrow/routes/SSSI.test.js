const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('SSSI page', () => {
  let crumCookie
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/SSSI'
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
      url: '/SSSI',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the project directly impacts a Site of Special Scientific Interest')
  })

  it('should store valid user input and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/SSSI',
      payload: { sSSI: 'Yes', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })
})
