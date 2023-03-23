const { crumbToken } = require('./test-helper')

describe('Project and business details page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes',
    projectStarted: 'No',
    landOwnership: 'Yes',
    projectItemsList: {
      projectEquipment: ['Boom', 'Trickle']
    },
    projectCost: '12345678',
    remainingCost: 14082.00,
    payRemainingCosts: 'Yes',
    planningPermission: 'Will not be in place by 31 October 2024',
    abstractionLicence: 'Not needed',
    businessDetails: {
      projectName: 'Project Name',
      businessName: 'Business Name'
    }
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/business-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a project name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter the number of employees')
    expect(postResponse.payload).toContain('Enter the business turnover')
  })

  it('should validate number of employees - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number of employees must be a whole number, like 305')
  })

  it('should validate number of employees - character limit is 4', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        numberEmployees: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Number must be between 1-9999')
  })

  it('should validate business turnover - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate business turnover - character limit is 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        businessTurnover: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Business turnover must be a whole number, like 100000')
  })

  it('should validate SBI - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        inSbi: 'Yes',
        sbi: '123e',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - no spaces', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        inSbi: 'Yes',
        sbi: '123 45',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be less than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        inSbi: 'Yes',
        sbi: '12345678',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should validate SBI - characters must not be more than 9', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
      payload: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        numberEmployees: '1234',
        businessTurnover: '5678',
        inSbi: 'Yes',
        sbi: '1234567890',
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('SBI number must have 9 characters, like 011115678')
  })

  it('should store user response and redirects to applicant page, sbi is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
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

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`applying`)
  })

  it('should store user response and redirects to applicant page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/business-details`,
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

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`applying`)
  })
})
