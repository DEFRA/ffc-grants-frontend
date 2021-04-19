describe('Server test', () => {
  let server

  it('createServer returns server', async () => {
    const createServer = require('../../../../app/server')
    server = await createServer()
    expect(server).toBeDefined()
  })

  afterEach(async () => {
    await server.stop()
  })
})
