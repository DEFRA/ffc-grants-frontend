const { crumbToken } = require('./test-helper')

describe('Project start page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes',
    projectStarted: 'No, we have not done any work on this project yet'
  }
  const projectStarted = varList.projectStarted

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
      url: `${global.__URLPREFIX__}/project-start`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the option that applies to your project')
  })

  it('should redirect to details pagewhen user selects "No"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStarted, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/tenancy`)
  })

  it('should redirect to ineligible page when user selects "Yes, we have begun project work (for example digging, signing contracts, placing orders)"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStarted: 'Yes, we have begun project work (for example digging, signing contracts, placing orders)', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
  })
  it('should redirect to ineligible page when user selects "Yes, preparatory work (for example quotes from suppliers, applying for planning permission)"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStarted: 'Yes, preparatory work (for example quotes from suppliers, applying for planning permission)', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/tenancy`)
  })
})
