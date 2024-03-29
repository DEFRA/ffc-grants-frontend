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
    farmerDetails: {
      firstName: 'First Name',
      lastName: 'Last Name'
    }
  }
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

describe('Applicant details page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page if getYarValues not found', async () => {

    varList = {
      farmerDetails: null,
      applying: 'Agent'
    }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applicant-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })


  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Confirm your email address')
    expect(postResponse.payload).toContain('Enter your building and street details')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your business postcode, like AA1 1AA')
    expect(postResponse.payload).toContain('Enter a project postcode, like AA1 1AA')
  })

  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
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
      url: `${global.__URLPREFIX__}/applicant-details`,
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

  it('should validate email - wrong email format', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
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

  it('should validate email - confirmation mismatch', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'another@name.com',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        projectPostcode: 'AA1 1AA',
        businessPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address that matches')
  })

  it('should validate mobile - if typed in special characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
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
      url: `${global.__URLPREFIX__}/applicant-details`,
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
      url: `${global.__URLPREFIX__}/applicant-details`,
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
      url: `${global.__URLPREFIX__}/applicant-details`,
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

  it('should validate landline- less than 10 digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
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

  it('should store user response and redirects to check details page, landline is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`check-details`)
  })

  it('should store user response incase Agent is applying redirects to check details page, landline is optional', async () => {
    varList.applying = 'Agent'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`check-details`)
  })

  it('should store user response incase Agent is applying redirects to check details page, mobile is optional', async () => {
    varList.applying = 'Agent'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        landline: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`check-details`)
  })

  it('should validate - if mobile and landline are missing', async () => {
    varList.applying = 'Agent'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }
    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a mobile number (if you do not have a mobile, enter your landline number)')
    expect(postResponse.payload).toContain('Enter a landline number (if you do not have a landline, enter your mobile number)')
  })

  it('should store user response and redirects to details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`check-details`)
  })

  it('should validate - if both mobile and landline are missing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        emailAddress: 'my@name.com',
        emailConfirm: 'my@name.com',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
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
      url: `${global.__URLPREFIX__}/applicant-details`,
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

  it('should validate town - not empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        emailAddress: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
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
      url: `${global.__URLPREFIX__}/applicant-details`,
      payload: {
        firstName: 'Farmer First Name',
        lastName: 'Farmer Last Name',
        emailAddress: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: '12345',
        county: 'Devon',
        businessPostcode: 'AA1 1AA',
        projectPostcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Town must only include letters, hyphens and spaces')
  })

})
