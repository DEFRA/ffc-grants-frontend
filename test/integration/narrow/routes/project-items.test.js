describe('Irrigation water source page', () => {
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  test('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/project-items'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('should return error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: {}
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all the items your project needs')
  })

  test('should store user response from column: "projectInfrastucture" and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectInfrastucture: 'Synthetic liner' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  test('should store user response from column: "projectEquipment" and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectEquipment: ['Boom', 'Trickle'] }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  test('should store user response from column: "projectTechnology" and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectTechnology: 'Software to monitor soil moisture levels and schedule irrigation' }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  test('should store user response from all columns and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: {
        projectInfrastucture: 'Overflow/spillway',
        projectEquipment: ['Ebb and flood or capillary bed', 'Sprinklers and mist'],
        projectTechnology: 'Software and sensors to optimise water application'
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-details')
  })

  afterEach(async () => {
    await server.stop()
  })
})
