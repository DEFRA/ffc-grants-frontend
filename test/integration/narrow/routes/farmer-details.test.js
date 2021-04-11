const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Farmer details page', () => {
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
      url: '/farmer-details'
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
      url: '/farmer-details',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
  })

  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-details',
      payload: {
        firstName: '123',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-details',
      payload: {
        lastName: '123',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should store user response and redirects to farmer contact page, title is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-details',
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./farmer-contact-details')
  })

  it('should store user response and redirects to farmer contact page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-details',
      payload: {
        title: 'Title',
        firstName: 'First Name',
        lastName: 'Last Name',
        crumb: crumToken
      },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./farmer-contact-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
