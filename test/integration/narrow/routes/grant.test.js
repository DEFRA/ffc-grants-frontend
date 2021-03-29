describe('Grant page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/grant'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/grant',
      payload: {}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
