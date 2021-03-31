describe('Grant page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('redirects to project-cost if user project-cost has not been saved', async () => {
    const options = {
      method: 'GET',
      url: '/grant'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./project-cost')
  })

  it('redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/grant',
      payload: {}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./remaining-costs')
  })

  afterEach(async () => {
    await server.stop()
  })
})
