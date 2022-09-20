const varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  planningPermission: 'some data',
  projectStarted: 'No',
  landOwnership: 'Yes',
  projectItemsList: {
    projectEquipment: ['Boom', 'Trickle']
  },
  projectCost: '12345678',
  remainingCost: 14082.00,
  payRemainingCosts: 'Yes',
  sSSI: 'yes',
  abstractionLicence: 'Not needed',
  project: ['some fake project'],
  irrigatedCrops: 'some crop',
  currentlyIrrigating: 'yes',
  irrigatedLandCurrent: '123',
  irrigatedLandTarget: '456',
  waterSourceCurrent: ['some source 1'],
  waterSourcePlanned: ['some source 2', 'another source'],
  irrigationCurrent: ['some source 2', 'another source'],
  irrigationPlanned: ['some souce 2'],
  'current-score': ''
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
describe('Irrigation syatems page', () => {

  const { crumbToken } = require('./test-helper')

  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-systems`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page with no yarValues successfully', async () => {
    varList = {}
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-systems`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no water system option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 systems currently used to irrigate')
    expect(postResponse.payload).toContain('Select up to 2 systems that will be used to irrigate')
  })

  it('should store user response and redirects to productivity page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { irrigationCurrent: 'fake current system', irrigationPlanned: 'fake new system', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/productivity`)
  })

  it('should store user response and redirects to score page if results', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { irrigationCurrent: 'fake current system', irrigationPlanned: 'fake new system', results: '234', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
  })

  it('should store user response if no yar value and redirects to productivity page', async () => {
    varList = {}
    
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { irrigationCurrent: '', irrigationPlanned: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/productivity`)
  })
  
  it('redirects to irrigation-systems if user irrigationCurrent, irrigationPlanned and currentlyIrrigating has not been saved', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { irrigationCurrent: undefined, irrigationPlanned: undefined, currentlyIrrigating: undefined, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
  })
  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: {
        irrigationCurrent: ['some option-1', 'some option-2', 'some option-3'],
        irrigationPlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 systems currently used to irrigate')
    expect(postResponse.payload).toContain('Select up to 2 systems that will be used to irrigate')
  })

  it('should display the error summary if irrigationCurrent has 3 options selected', async () => {
    varList = {}
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: {
        irrigationCurrent: ['1', '2', '3'],
        irrigationPlanned: [],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 systems currently used to irrigate')
  })

  it('should display the error summary if irrigationPlanned has 3 options selected', async () => {
    varList = {}
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: {
        irrigationCurrent: [],
        irrigationPlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 systems that will be used to irrigate')
  })

  it('should display the current irrrigation systems question if the user selected YES for currently irrigating', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<h1 class="govuk-heading-l">Irrigation system</h1>')
    expect(response.payload).toContain('What systems are currently used to irrigate?')
    expect(response.payload).toContain('What systems will be used to irrigate?')
  })

  it('should NOT display the current irrigation systems question if the user selected NO for currently irrigating', async () => {
    varList.currentlyIrrigating = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).not.toContain('<h1 class="govuk-heading-l">What systems will be used to irrigate?</h1>')
    expect(response.payload).not.toContain('What systems are currently used to irrigate?')
  })
})
