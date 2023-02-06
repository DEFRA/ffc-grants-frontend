const { crumbToken } = require('./test-helper')
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
  currentlyIrrigating: 'Yes',
  irrigatedLandCurrent: '123',
  irrigatedLandTarget: '456',
  waterSourceCurrent: ['some source 1'],
  waterSourcePlanned: ['some source 2', 'another source'],
  'current-score': null
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

describe('Irrigation water source page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page with no yars successfully', async () => {
    varList = {
      waterSourceCurrent: null,
      waterSourcePlanned: null,
      'current-score': null
    }

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
  it('should returns error message if no water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 options for where your current irrigation water comes from')
    expect(postResponse.payload).toContain('Select up to 2 options for where your irrigation water will come from')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { waterSourceCurrent: 'some option-1', waterSourcePlanned: 'another-option-1', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/irrigation-system`)
  })

  it('should store user response and redirects to scores page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { waterSourceCurrent: 'some option-1', waterSourcePlanned: 'another-option-1', results: 'result', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
  })

  it('redirects to irrigation-water-source if user waterSourceCurrent and waterSourcePlanned have not been saved', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { waterSourceCurrent: undefined, waterSourcePlanned: undefined, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
  })

  it('should display the error summary if more than two options are selected for each question', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2', 'some option-3'],
        waterSourcePlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 options for where your current irrigation water comes from')
    expect(postResponse.payload).toContain('Select up to 2 options for where your irrigation water will come from')
  })

  it('should display the error summary if more than two options are selected for current', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2', 'some option-3'],
        waterSourcePlanned: ['another-option-1', 'another-option-2'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 options for where your current irrigation water comes from')
  })

  it('should display the error summary if more than two options are selected for planned', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2'],
        waterSourcePlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select up to 2 options for where your irrigation water will come from')
  })



  it('should display the current water source question if the user selected YES for currently irrigating', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<h1 class="govuk-heading-l">Water source</h1>')
    expect(response.payload).toContain('Where does your current irrigation water come from?')
    expect(response.payload).toContain('Where will the irrigation water come from?')
  })

  it('should NOT display the current water source question if the user selected NO for currently irrigating', async () => {
    varList.currentlyIrrigating = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).not.toContain('<h1 class="govuk-heading-l">Water source</h1>')
    expect(response.payload).toContain('Where will the irrigation water come from?')
  })

  it('should redirect to start if previous question not answered', async () => {
    varList.summerAbstractionMains = null

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/start`)
  })
})
