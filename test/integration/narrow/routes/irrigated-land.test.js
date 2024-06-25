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
  abstractionLicence: 'Not needed',
  project: ['some fake project'],
  irrigatedCrops: 'some crop',
  currentlyIrrigating: 'yes',
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

describe('Irrigated Land page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page if no yar values successfully', async () => {
    varList = {
      irrigatedLandCurrent: null,
      irrigatedLandTarget: null,
      'current-score': null
    }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should shows error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should return an error message if no value is entered for currently irrigated land', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandTarget: '456.7', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares are irrigated currently')
  })

  it('should return an error message if no value is entered for \'total irrigated land target\' ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: '123', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter how many hectares will be irrigated after the project')
  })

  it('should validate current irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: 'e', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate current irrigated land - no decimal point without a whole number or a fraction', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: '.', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate current irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: '123.45', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate target irrigated land - only digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandTarget: 'e', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate target irrigated land - no decimal point without a whole number or a fraction', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandTarget: '.', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate target irrigated land - max 1 fraction digit', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandTarget: '123.45', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Hectare value must be a number, with only one decimal place')
  })

  it('should validate target irrigated land - value cannot be 0', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: {
        irrigatedLandCurrent: '-1',
        irrigatedLandTarget: '0',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Figure must be higher than 0')
  })

  it('value of target irrigated land must not be lower than current value', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: {
        irrigatedLandCurrent: '2',
        irrigatedLandTarget: '1',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Figure must be equal to or higher than current hectares')
  })

  it('value of target irrigated land will show 0 error if value lower and equals 0', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: {
        irrigatedLandCurrent: '2',
        irrigatedLandTarget: '0',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Figure must be higher than 0')
  })

  it('should store user response and redirects to water source page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: '123.4', irrigatedLandTarget: '567.8', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/productivity`)
  })

  it('should store user response and redirects to score page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandCurrent: '123.4', irrigatedLandTarget: '567.8', results: 'result', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
  })

  it('should store default 0 for irrigatedLandCurrent if user select currently Irrigating NO', async () => {
    varList.currentlyIrrigating = 'No'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      payload: { irrigatedLandTarget: '567.8', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('class="govuk-input" id="irrigatedLandCurrent" name="irrigatedLandCurrent" type="hidden" value="0"')
  })

  it('should display the current irrigated land question if the user selected YES for currently irrigating', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<h1 class="govuk-heading-l">Irrigated land</h1>')
    expect(response.payload).toContain('How much land is currently irrigated per year?')
    expect(response.payload).toContain('How much land will be irrigated per year after the project?')
  })

  it('should not display the current irrigated land question if the user selected NO for currently irrigating', async () => {
    varList.currentlyIrrigating = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).not.toContain('<h1 class="govuk-heading-l">Irrigated land</h1>')
    expect(response.payload).toContain('How much land will be irrigated per year after the project?')
  })

  it('should redirect to start if previous question not answered', async () => {
    varList.currentlyIrrigating = null

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-land`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/start`)
  })
})
