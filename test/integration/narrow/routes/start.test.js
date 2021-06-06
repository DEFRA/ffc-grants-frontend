describe('Start Page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load start page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/start`
    }

    const response = await server.inject(options)
    expect(response.headers['x-robots-tag']).toContain('noindex, nofollow')
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
