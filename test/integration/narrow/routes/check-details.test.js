const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Check Details page', () => {
  const varList = {
    businessDetails: {
      projectName: 'Project Name',
      businessName: 'Business Name',
      applying: 'Farmer'
    },
    farmerDetails: {
      firstName: 'First Name',
      lastName: 'Last Name',
      address1: '12 Henley Wood Road',
      address2: '12 Henley Wood Road',
      town: 'Reading',
      county: 'Berkshire',
      postcode: 'RG6 7EE',
      email: 's@s.com',
      landline: '',
      mobile: '012346789'
    },
    agentDetails: {
      firstName: 'First Name',
      lastName: 'Last Name',
      address1: '12 Henley Wood Road',
      address2: null,
      town: 'Reading',
      county: 'Berkshire',
      postcode: 'RG6 7EE',
      email: 's@s.com',
      landline: '',
      mobile: '012346789'
    }
  }

  jest.mock('../../../../app/messaging/create-msg', () => ({
    getAllDetails: (request, id) => {
      return varList
    }
  }))

  afterEach(() => {
    jest.resetAllMocks()
  })
  let crumCookie
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/check-details'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(3)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should have Check your details title', async () => {
    const options = {
      method: 'GET',
      url: '/check-details',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    console.log(response.headers.location, 'Redirect Location')
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('Check your details')
  })

  it('should have back link to formers-details', async () => {
    const options = {
      method: 'GET',
      url: '/check-details',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    console.log(response.headers.location, 'Redirect Location')
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('./farmer-details')
  })

  it('should have continue button to redirect to confirm page ', async () => {
    const options = {
      method: 'POST',
      url: '/check-details',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./confirm')
  })
})
