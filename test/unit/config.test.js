const config = require('../../app/config')
const cookiePassword = process.env.COOKIE_PASSWORD
describe('get config', () => {
  afterAll(async () => {
    process.env.COOKIE_PASSWORD = cookiePassword
  })

  test('Should pass validation for all fields populated', async () => {
    expect(config).toBeDefined()
  })
})
