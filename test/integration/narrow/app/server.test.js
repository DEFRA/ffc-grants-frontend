describe('Server test', () => {
  test('createServer returns server', async () => {
    const createServer = require('../../../../app/server')
    const server = await createServer()
    expect(server).toBeDefined()
  })
})
