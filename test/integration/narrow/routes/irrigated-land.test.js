const { getCookieHeader, getCrumbCookie } = require('./test-helper')
describe('Irrigated Land page', () => {
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
      url: '/irrigated-land'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should shows error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should return an error message if no value is entered for \'currently irrigated land\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '456.7', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
  })

  it('should return an error message if no value is entered for \'total irrigated land target\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should validate current irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: 'e', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate current irrigated land - max 3 whole digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '1234', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate current irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123.45', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: 'e', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - max 3 whole digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '1234', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '123.45', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should store user response and redirects to water source page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123.4', irrigatedLandTarget: '567.8', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigation-water-source')
  })

  afterEach(async () => {
    await server.stop()
  })
})
