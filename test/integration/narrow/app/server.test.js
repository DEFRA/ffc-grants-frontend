const { setup } = require('../../../../app/services/app-insights')
jest.mock('../../../../app/services/app-insights')

describe('Server test', () => {
  let server

  it('createServer returns server', async () => {
    const createServer = require('../../../../app/server')
    server = await createServer()
    expect(server).toBeDefined()
    expect(setup).toHaveBeenCalledTimes(1)
  })

  afterEach(async () => {
    await server.stop()
  })
})
