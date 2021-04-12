const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Agent contact details page', () => {
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
      url: '/agent-contact-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter your mobile number')
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@@name.com',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })

  it('should validate landline (optional) - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        landline: '1234567a90',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate mobile', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        landline: '(123):456789010',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should store user response and redirects to agent address page, title is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@name.com',
        mobile: '07700 900 982',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-address-details')
  })

  it('should store user response and redirects to agent address page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-address-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
