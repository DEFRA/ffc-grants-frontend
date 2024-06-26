const { getCookieHeader, getCrumbCookie, crumbToken } = require('./test-helper')
describe('Check Details page', () => {
  const varList =
    {
      businessDetails: {
        projectName: 'Project Name',
        businessName: 'Business Name',
        applying: 'Applicant'
      },
      farmerDetails: {
        firstName: 'First Name',
        lastName: 'Last Name',
        address1: '12 Henley Wood Road',
        address2: '12 Henley Wood Road',
        town: 'Reading',
        county: 'Berkshire',
        projectPostcode: 'RG6 7EE',
        businessPostcode: 'N3 4RR',
        emailAddress: 's@s.com',
        landline: '9876543210',
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
        emailAddress: 's@s.com',
        landline: '9876543210',
        mobile: '012346789'
      }
    }
  const mockSession = {
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[ key ]
      else return 'Error'
    }
  }

  jest.mock('../../../../app/helpers/session', () => mockSession)

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
      url: `${global.__URLPREFIX__}/check-details`
    }

    const response = await global.__SERVER__.inject(options)

    expect(response.statusCode).toBe(200)
    const header = getCookieHeader(response)
    expect(header.length).toBe(2)
    crumCookie = getCrumbCookie(response)
    expect(response.result).toContain(crumCookie[1])
  })

  it('should have Check your details title', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/check-details`,
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

  it('should have back link to applicant-details', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/check-details`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    console.log(response.headers.location, 'Redirect Location')
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain(`<a href=\"applicant-details\" class=\"govuk-back-link\"`)
  })

  it('should have farmers-details rendered in rows', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/check-details`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('12 Henley Wood Road<br/>12 Henley Wood Road<br/>Reading<br/>Berkshire')
    expect(response.payload).toContain('012346789')
    expect(response.payload).toContain('9876543210')
  })

  it('should have continue button to redirect to confirm page ', async () => {
    const options = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/check-details`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`confirm`)
  })
})
