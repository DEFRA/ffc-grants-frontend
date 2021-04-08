const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Applicant page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
  let server
  const createServer = require('../../../../app/server')
  let crumCookie

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/applying'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select who is applying for this grant')
  })

  it('if applicant: AGENT, should store user response and redirect to agent details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { crumb: crumCookie[1], applying: 'Agent' },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-details')
  })

  it('if applicant: FARMER, should store user response and redirect to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { crumb: crumCookie[1], applying: 'Farmer' },
      headers: {
        cookie: 'crumb=' + crumCookie[1]
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirm')
  })

  afterEach(async () => {
    await server.stop()
  })
})
