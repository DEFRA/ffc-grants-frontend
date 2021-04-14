
describe('Confirmation page', () => {
  let crumCookie
  let server
  const { getCookieHeader, getCrumbCookie } = require('./test-helper')
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('ffc-messaging')
    server = await createServer()
    await server.start()
  })
  it('should load page with error score', async () => {
    const senders = require('../../../../app/messaging/senders')
    senders.sendContactDetails = jest.fn(async function (model, yarId) {
      throw new Error('Some error')
    })
    const options = {
      method: 'GET',
      url: '/confirmation'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should load page with sucess', async () => {
    const options = {
      method: 'GET',
      url: '/confirmation'
    }
    const senders = require('../../../../app/messaging/senders')
    senders.sendContactDetails = jest.fn(async function (model, yarId) {
      return ''
    })
    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  afterEach(async () => {
    await server.stop()
  })
})
