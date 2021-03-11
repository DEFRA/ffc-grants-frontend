describe('Collaboration page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/collaboration'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/collaboration',
      payload: { collaboration: null }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  test('should store user response and redirects to answers page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/collaboration',
      payload: { collaboration: 'some fake data' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./answers')
  })

  afterEach(async () => {
    await server.stop()
  })
})
