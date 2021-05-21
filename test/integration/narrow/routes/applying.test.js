const { crumbToken } = require('./test-helper')

describe('Applicant page', () => {
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
      businessName: 'Business Name',
      applying: 'Farmer'
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
      url: '/applying'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select who is applying for this grant')
  })

  it('if applicant: AGENT, should store user response and redirect to agent details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { applying: 'Agent', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-details')
  })

  it('if applicant: FARMER, should store user response and redirect to farmer details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/applying',
      payload: { applying: 'Farmer', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./farmer-details')
  })
})
