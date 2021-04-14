const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Project and business details page', () => {
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
      url: '/business-details'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter the number of employees')
    expect(postResponse.payload).toContain('Enter the business turnover')
  })

  it('should validate number of employees - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        numberEmployees: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        numberEmployees: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - character limit is 7', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        numberEmployees: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate business turnover - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        businessTurnover: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        businessTurnover: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - character limit is 9', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        businessTurnover: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate SBI - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        sbi: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        sbi: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        sbi: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        sbi: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should store user response and redirects to applicant page, sbi is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./applying')
  })

  it('should store user response and redirects to applicant page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/business-details',
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        sbi: '012345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./applying')
  })

  afterEach(async () => {
    await server.stop()
  })
})
