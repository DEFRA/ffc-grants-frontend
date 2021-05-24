const { crumbToken } = require('./test-helper')

describe('Farmer address details page', () => {
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
      url: '/farmer-address-details'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)

  })

  it('should validate postcode - raise error when postcode is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-address-details',
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

  it('should store user response and redirect to confirm page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/farmer-address-details',
      payload: {
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
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirm')
  })
})
