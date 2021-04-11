const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Agent address details page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
  let crumCookie
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/agent-address-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should validate postcode', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-address-details',
      payload: {
        postcode: 'aa1aa',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a postcode, like AA1 1AA')
  })

  it('should store user response and redirect to confirm page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-address-details',
      payload: {
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'DEVON',
        postcode: 'AA1 1AA',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirm')
  })

  afterEach(async () => {
    await server.stop()
  })
})
