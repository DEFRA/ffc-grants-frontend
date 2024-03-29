const { not } = require('joi')
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
  abstractionLicence: 'Not needed'
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
xdescribe('Project summary page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select up to 2 options')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
      payload: { project: 'Improve irrigation efficiency', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('irrigated-crops')
  })

  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
      payload: { project: ['some option-1', 'some option-2', 'some option-3'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
  })

  it('should display the error summary if more than one options are selected along with None of above', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`,
      payload: { project: ['Improve irrigation efficiency', 'None of the above'], crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('If you select &#39;None of the above&#39;, you cannot select another option')
  })

  it('should have a back link if score NOT reached', async () => {
    varList['current-score'] = null;
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(`<a href=\"abstraction-licence\" class=\"govuk-back-link\">Back</a>`)
  })

  it('should not have a back link if score is present', async () => {
    varList['current-score'] = 'some score'
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/summer-abstraction-mains`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).not.toContain(`<a href=\"abstraction-licence\" class=\"govuk-back-link\">Back</a>`)
  })
})
