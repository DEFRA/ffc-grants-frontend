describe('Water tenancy page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/tenancy'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: {}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the farm business owns')
  })

  test('should redirect to tenancy length page when user selects "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: { landOwnership: 'No' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./tenancy-length')
  })

  test('should redirect to project details page when user selects "Yes"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/tenancy',
      payload: { landOwnership: 'Yes' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
