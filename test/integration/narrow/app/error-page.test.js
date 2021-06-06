describe('Error Page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should return 404', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/somethingnotavailable`
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    await server.stop()
  })
})
