const { crumbToken } = require('./test-helper')
let varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  projectStarted: 'No, we have not done any work on this project yet',
  'current-score': null,
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

describe('Project start page', () => {
  const projectStarted = varListTemplate.projectStarted

  beforeEach(() => {
    varList = { ...varListTemplate }
  })

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

  it('should redirect to project summary page if theres score', async () => {
    varList['current-score'] = true

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-start`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/water-source`)
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
    expect(postResponse.payload).toContain('Select whether you have started work on the project')
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
    expect(postResponse.headers.location).toBe('tenancy')
  })

  it('should redirect to ineligible page when user selects "Yes, we have begun project work"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStarted: 'Yes, we have begun project work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant if you have already started work on the project.'
    )
  })
  it('should redirect to ineligible page when user selects "Yes, preparatory work"', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-start`,
      payload: { projectStarted: 'Yes, preparatory work', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('tenancy')
  })

  it(`page loads with correct back link when planning permission is "Should be in place by 31 January 2023" `, async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-start`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planning-permission-condition\" class=\"govuk-back-link\">Back</a>')
  })

  it('page loads with correct back link when planning permission is Secured', async () => {
    varListTemplate = {
      farmingType: 'some fake crop',
      legalStatus: 'fale status',
      inEngland: 'Yes',
      planningPermission:'Secured',
      projectStarted: 'No, we have not done any work on this project yet',
      'current-score': null,
    }
    varList = { ...varListTemplate }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-start`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planning-permission\" class=\"govuk-back-link\">Back</a>')
  })

})
