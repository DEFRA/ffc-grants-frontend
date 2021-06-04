const { crumbToken } = require('./test-helper')

const varListTemplate = {
  farmerDetails: {
    firstName: 'some fake farmer',
    lastName: 'surname'
  }
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

describe('Confirm page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/confirm',
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/farmer-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should redirect to /start page if the referer URL is NOT farmer-details', async () => {
    const options = {
      method: 'GET',
      url: '/confirm',
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/project-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./start')
  })

  it('should redirect to /start page if farmerAddressDetails are missing', async () => {
    varList.farmerAddressDetails = null
    const options = {
      method: 'GET',
      url: '/confirm',
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./start')
  })

  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { consentOptional: 'some conscent', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirmation')
  })
})
