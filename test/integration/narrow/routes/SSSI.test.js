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
  planningPermission: 'Will not be in place by 31 January 2023',
  abstractionLicence: 'Not needed',
  sSSI: 'Yes',
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

describe('SSSI page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/SSSI`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page successfully if sssi missing', async () => {
    varList = {
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
      planningPermission: 'Will not be in place by 31 January 2023',
      abstractionLicence: 'Not needed',
      sSSI: undefined,
      'current-score': null

    }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/SSSI`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should redirect to project summary page when theres score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/SSSI`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/water-source`)
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/SSSI`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the project directly impacts a Site of Special Scientific Interest')
  })

  it('should store valid user input and redirect to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/SSSI`,
      payload: { sSSI: 'Yes', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`abstraction-licence`)
  })
})
