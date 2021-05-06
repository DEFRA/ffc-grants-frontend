
const serverConfig = require('../../../../../app/config/server')

describe('get Server Config defined', () => {
  test('Should be defined', () => {
    expect(serverConfig).toBeDefined()
  })
})
