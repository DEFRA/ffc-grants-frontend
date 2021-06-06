const { crumbToken } = require('./test-helper')

describe('Water tenancy page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes',
    projectStarted: 'No',
    landOwnership: 'Yes'
  }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/tenancy`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the planned project is on land the farm business owns')
  })

  it('should redirect to tenancy length page when user selects "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      payload: { landOwnership: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/tenancy-length`)
  })

  it('should redirect to project items page when user selects "Yes"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/tenancy`,
      payload: { landOwnership: 'Yes', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/project-items`)
  })
})
