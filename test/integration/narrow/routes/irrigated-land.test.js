const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Irrigated Land page', () => {
  let crumCookie
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/irrigated-land'
    }

    const response = await global.__SERVER__.inject(options)
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
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should return an error message if no value is entered for \'currently irrigated land\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '456.7', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
  })

  it('should return an error message if no value is entered for \'total irrigated land target\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should validate current irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: 'e', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate current irrigated land - max 3 whole digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '1234', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate current irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123.45', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: 'e', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - max 3 whole digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '1234', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should validate target irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandTarget: '123.45', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare figure can have one decimal place')
  })

  it('should store user response and redirects to water source page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-land',
      payload: { irrigatedLandCurrent: '123.4', irrigatedLandTarget: '567.8', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigation-water-source')
  })
})
