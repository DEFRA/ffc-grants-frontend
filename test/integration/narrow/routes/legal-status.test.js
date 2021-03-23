describe('Legal status page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/legal-status'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/legal-status',
      payload: { legalStatus: null }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one option')
  })

  it('should store user response and redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/legal-status',
      payload: { legalStatus: 'some status' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./country')
  })

  it('should redirect to ineligible page when lagal staus is others', async () => {
    const postOptions = {
      method: 'POST',
      url: '/legal-status',
      payload: { legalStatus: 'Other' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
  })
  afterEach(async () => {
    await server.stop()
  })
})
