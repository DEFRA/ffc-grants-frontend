const config = require('../../app/config/server')

describe('get config', () => {
  test('Should pass validation for all fields populated', async () => {
    expect(config).toBeDefined()
  })
})
