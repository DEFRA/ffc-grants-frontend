const { crumbToken } = require('./test-helper')

describe('Farmer contact details page', () => {
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
    planningPermission: 'Will not have by 31 December 2021',
    abstractionLicence: 'Not needed',
    sSSI: 'Yes',
    businessDetails: {
      projectName: 'Project Name',
      businessName: 'Business Name'
    },
    applying: 'Farmer',
    farmerDetails: {
      firstName: 'First Name',
      lastName: 'Last Name'
    },
    farmerContactDetails: {
      email: 'my@name.com'
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
      url: '/farmer-contact-details'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter your mobile number')
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
      payload: {
        email: 'my@@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })

  it('should validate landline (optional) - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
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

  it('should validate mobile', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
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

  it('should store user response and redirects to farmer address page, title is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
      payload: {
        email: 'my@name.com',
        mobile: '07700 900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./farmer-address-details')
  })

  it('should store user response and redirects to farmer address page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-contact-details',
      payload: {
        email: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./farmer-address-details')
  })
})
