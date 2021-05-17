const { crumbToken } = require('./test-helper')
describe('Confirm page', () => {
  const farmerAddressDetails = 'some fake farmer details'

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      switch (key) {
        case 'farmerAddressDetails':
          return farmerAddressDetails
        default:
          return 'Error'
      }
    }
  }))

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/confirm',
      headers: {
        cookie: 'crumb=' + crumbToken,
        referer: 'localhost/farmer-address-details'
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return error message if main confirm checkbox (the first) is not selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Please confirm you are happy to be contacted about your application.')
  })

  it('should store user response and redirects to confirmation page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { consentMain: 'CONSENT_MAIN', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./confirmation')
  })
})
