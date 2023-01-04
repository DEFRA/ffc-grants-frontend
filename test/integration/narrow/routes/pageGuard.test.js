const createServer = require('../../../../app/server')
const { startPageUrl } = require('../../../../app/config/server')

describe('Page Guard', () => {
  const OLD_ENV = process.env
  let server

  beforeEach(async () => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterEach(() => {
    process.env = OLD_ENV
    server.stop()
  })

  it('shoud redirect to start page if the site is decommissioned', async () => {
    process.env.SERVICE_END_DATE = '2025/01/12'
    process.env.SERVICE_END_TIME = '23:59:58'
    server = await createServer()
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const getResponse = await server.inject(getOptions)
    expect(getResponse.statusCode).toBe(302)
    expect(getResponse.headers.location).toBe(startPageUrl)
  })
})
