const { crumbToken } = require('./test-helper')
const varListTemplate = {
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
    businessName: 'Business Name',
    applying: 'Farmer',
    agentDetails: {
      firstName: 'First Name',
      lastName: 'Last Name'
    }
  },
  agentDetails: 'testing'
}

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return 'Error'
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Agent details page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agent-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page with no yar successfully', async () => {
    varList = {
      agentDetails: null
    }

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agent-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter your business name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Confirm your email address')
    expect(postResponse.payload).toContain('Enter your building and street details')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your postcode, like AA1 1AA')
  })

  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        lastName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate bussiness name - no special characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        businessName: '$@business',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        emailAddress: 'my@@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })
  it('should validate email confirmation', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        emailAddress: 'my@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Confirm your email address')
  })

  it('should validate email - confirmation mismatch', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'hello',
        email: 'my@name.com',
        emailConfirm: 'another@name.com',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address that matches')
  })

  it('should throw error when confirm email is not entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: '',
        email: 'my@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Confirm your email address')
  })

  it('should validate landline - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '12345679a0${',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate mobile correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate landline correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate - if both mobile and landline are missing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        businessName: 'hello',
        email: 'my@name.com',
        emailConfirm: 'my@name.com',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)

    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a mobile number (if you do not have a mobile, enter your landline number)')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })

  it('should validate - if both mobile and landline are empty', async () => {
    varList = {
      farmerDetails: null,
      applying: 'Agent'
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '',
        landline: '',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a mobile number (if you do not have a mobile, enter your landline number)')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })

  it('should validate - if both mobile and landline are added', async () => {
    varList = {
      farmerDetails: null,
      applying: 'Agent'
    }

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '07432659876',
        landline: '08765432564',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
  })

  it('should validate mobile - if typed in special characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '(123):456789010',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate mobile - less than 10 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '2345',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your mobile number must have at least 10 characters')
  })

  it('should validate landline - if typed in alphabet', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '1234567a90',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate landline - if typed in special characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '(123):456789010',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate landline - less than 10 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '1234',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Your landline number must have at least 10 characters')
  })

  it('should validate postcode - raise error when postcode is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a postcode, like AA1 1AA')
  })

  it('should store user responseand redircet to applicant-details', async () => {
    varList.applying = 'Agent'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'hello',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        mobile: '07700 900 982',
        landline: '',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    console.log('postResponse: ', postResponse.payload);
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applicant-details')
  })

  it('should store user responseand redircet to check-details', async () => {
    varList.applying = 'Agent'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'hello',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        mobile: '07700 900 982',
        landline: '',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        results: 'hello',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/check-details`)
  })

  it('should validate town - not empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        businessName: 'hello',
        email: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your town')
  })

  it('should validate town - invalid characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        businessName: 'hello',
        email: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: '12345',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Town must only include letters, hyphens and spaces')
  })
})
