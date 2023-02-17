const { crumbToken } = require('./test-helper')
const varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  planningPermission: 'some data',
  projectStarted: 'No',
  landOwnership: 'Yes',
  projectItemsList: {
    projectEquipment: [ 'Boom', 'Trickle' ]
  },
  projectCost: '12345678',
  remainingCost: 14082.00,
  payRemainingCosts: 'Yes',
  sSSI: 'yes',
  abstractionLicence: 'Not needed',
  project: [ 'some fake project' ],
  irrigatedCrops: 'some crop',
  currentlyIrrigating: 'Yes',
  irrigatedLandCurrent: '123',
  irrigatedLandTarget: '456',
  waterSourceCurrent: [ 'some source 1' ],
  waterSourcePlanned: [ 'some source 2', 'another source' ],
  'current-score': null
}

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[ key ]
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
      url: `${global.__URLPREFIX__}/water-source`,
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
      url: `${global.__URLPREFIX__}/water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/water-source`,
      payload: { waterSourceCurrent: 'some option-1', waterSourcePlanned: 'another-option-1', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/irrigation-system`)
  })

  // it('should store user response and redirects to scores page', async () => {
  //   const postOptions = {
  //     method: 'POST',
  //     url: `${global.__URLPREFIX__}/water-source`,
  //     payload: { waterSourceCurrent: 'some option-1', waterSourcePlanned: 'another-option-1', results: 'result', crumb: crumbToken },
  //     headers: {
  //       cookie: 'crumb=' + crumbToken
  //     }
  //   }

  //   const postResponse = await global.__SERVER__.inject(postOptions)
  //   expect(postResponse.statusCode).toBe(302)
  //   expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
  // })

  it('redirects to water-source if user waterSourceCurrent and waterSourcePlanned have not been saved', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/water-source`,
      payload: { waterSourceCurrent: undefined, waterSourcePlanned: undefined, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
  })
  it('should display the current water source question if the user selected YES for currently irrigating', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<h1 class="govuk-heading-l">Water source</h1>')
    expect(response.payload).toContain('What is your current water source?')
    expect(response.payload).toContain('Where will the irrigation water come from?')
  })

  it('should NOT display the current water source question if the user selected NO for currently irrigating', async () => {
    varList.currentlyIrrigating = 'No'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/water-source`,
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
      url: `${global.__URLPREFIX__}/water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/start`)
  })
})


describe('Water-source page - Validations', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should returns error message if no current water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/water-source`,
      payload: { waterSourcePlanned: 'another-option-1', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select where your current irrigation water comes from')
  })

  it('should returns error message if no planned water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/water-source`,
      payload: { waterSourceCurrent: 'some option-1', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select where your irrigation water will come from')
  })

  describe('[Increase use of an unsustainable water is DISALLOWED]: "Summer water surface abstraction" and "Mains"', () => {
    it("ERRORS if the user selects [Mains] for planned water source AND they are NOT currently using the same water source", async () => {
      const postOptionsExample = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/water-source`,
        payload: {
          waterSourceCurrent: 'Summer water surface abstraction',
          waterSourcePlanned: 'Mains',
          crumb: crumbToken
        },
        headers: {
          cookie: 'crumb=' + crumbToken
        }
      }

      const postResponseMains = await global.__SERVER__.inject(postOptionsExample)
      expect(postResponseMains.statusCode).toBe(200)
      expect(postResponseMains.payload).toContain('You cannot increase use of an unsustainable water source')
    })

    it("ERRORS if the user selects [Summer water surface abstraction] for planned water source AND they are NOT currently using the same water source", async () => {
      const postOptionsExample = {
        method: 'POST',
        url: `${global.__URLPREFIX__}/water-source`,
        payload: {
          waterSourceCurrent: 'Mains',
          waterSourcePlanned: 'Summer water surface abstraction',
          crumb: crumbToken
        },
        headers: {
          cookie: 'crumb=' + crumbToken
        }
      }
      const postResponseSummer = await global.__SERVER__.inject(postOptionsExample)
      expect(postResponseSummer.statusCode).toBe(200)
      expect(postResponseSummer.payload).toContain('You cannot increase use of an unsustainable water source')
    })
  });
});
