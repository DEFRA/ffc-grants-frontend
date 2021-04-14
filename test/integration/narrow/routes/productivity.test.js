const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Project details page', () => {
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
      url: '/productivity'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/productivity',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  it('should store user response and redirects to collaboration page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/productivity',
      payload: { productivity: 'some fake value', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./collaboration')
  })

  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/productivity',
      payload: { productivity: ['some option-1', 'some option-2', 'some option-3'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
  })
  afterEach(async () => {
    await server.stop()
  })
})
