describe('Project start page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/project-start'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-start',
      payload: { projectStarted: null }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you have already started work on the project')
  })

  test('should redirect to details pagewhen user selects "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-start',
      payload: { projectStarted: 'No' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  test('should redirect to ineligible page when user selects "Yes"', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-start',
      payload: { projectStarted: 'Yes' }
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
