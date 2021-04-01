describe('Start Page', () => {
  process.env.COOKIE_PASSWORD = '1234567890123456789012345678901234567890'
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load start page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/start'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
