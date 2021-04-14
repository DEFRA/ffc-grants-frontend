const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Irrigation water source page', () => {
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
      url: '/project-items'
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
      url: '/project-items',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select all the items your project needs')
  })

  it('should store user response from column: "projectInfrastucture" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectInfrastucture: 'Synthetic liner', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from column: "projectEquipment" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectEquipment: ['Boom', 'Trickle'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from column: "projectTechnology" and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: { projectTechnology: 'Software to monitor soil moisture levels and schedule irrigation', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  it('should store user response from all columns and redirect to project cost page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/project-items',
      payload: {
        projectInfrastucture: 'Overflow/spillway',
        projectEquipment: ['Ebb and flood or capillary bed', 'Sprinklers and mist'],
        projectTechnology: 'Software and sensors to optimise water application',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./project-cost')
  })

  afterEach(async () => {
    await server.stop()
  })
})
