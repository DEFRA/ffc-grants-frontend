describe('Farming type page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/farming-type'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farming-type',
      payload: { }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the crops you are growing')
  })

  test('should store user response and redirects to legal status page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farming-type',
      payload: { farmingType: 'Horticulture' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./legal-status')
  })

  test('should redirect to ineligible page when farming type is \'Something else\'', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farming-type',
      payload: { farmingType: 'Something else' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
  })
  afterEach(async () => {
    await server.stop()
  })
})
