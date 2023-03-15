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
    applying: 'Applicant'
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


describe('Applicant page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applying`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page wiht no yar successfully', async () => {
    varList = {
      applying: null
    }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/applying`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying`,
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
      url: `${global.__URLPREFIX__}/applying`,
      payload: { applying: 'Agent', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('agent-details')
    expect(postResponse.headers.location).toBe(`agent-details`)
  })

  it('if applicant: APPLICANT, should store user response and redirect to applicant details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/applying`,
      payload: { applying: 'Applicant', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('applicant-details')
  })
})
