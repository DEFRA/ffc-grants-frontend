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
  planningPermission: 'Will not be in place by 31 December 2021',
  abstractionLicence: 'Not needed',
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

describe('Abstraction licence page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/abstraction-licence`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should redirect to project summary page if theres score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/abstraction-licence`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/project-summary`)
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/abstraction-licence`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select when the project will have an abstraction licence or variation')
  })

  it('if value = \'Should be in place by 31 December 2021\' ==> store and redirect to abstraction-required-condition page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/abstraction-licence`,
      payload: { abstractionLicence: 'Should be in place by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/abstraction-required-condition`)
  })

  it('if value = \'Will not be in place by 31 December 2021\' ==> store and redirect to abstraction-required-condition page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/abstraction-licence`,
      payload: { abstractionLicence: 'Will not be in place by 31 December 2021', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/abstraction-required-condition`)
  })

  it('if value = \'Not needed\' ==> store and redirect to project-summary page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/abstraction-licence`,
      payload: { abstractionLicence: 'Not needed', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/project-summary`)
  })

  it('if value = \'Secured\' ==> store and redirect to project-summary page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/abstraction-licence`,
      payload: { abstractionLicence: 'Secured', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/project-summary`)
  })
})
