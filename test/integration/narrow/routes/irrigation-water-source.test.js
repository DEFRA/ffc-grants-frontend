describe('Irrigation water source page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/irrigation-water-source'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no current water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourcePlanned: 'some souce 2' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  it('should returns error message if no planned water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourceCurrent: 'some souce 2' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please select an option')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: { waterSourceCurrent: 'some source 1', waterSourcePlanned: 'some souce 2' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigation-systems')
  })

  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigation-water-source',
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2', 'some option-3'],
        waterSourcePlanned: ['another-option-1', 'another-option-2']
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
  })
  afterEach(async () => {
    await server.stop()
  })
})
