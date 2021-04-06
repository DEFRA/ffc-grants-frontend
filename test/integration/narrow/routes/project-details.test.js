describe('Project details page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/project-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-details',
      payload: {}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two options')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-details',
      payload: { project: 'Improve irrigation efficiency' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigated-crops')
  })

  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-details',
      payload: { project: ['some option-1', 'some option-2', 'some option-3'] }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select one or two options of what the project will achieve')
  })
  afterEach(async () => {
    await server.stop()
  })
})
