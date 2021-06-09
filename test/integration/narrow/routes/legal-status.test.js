const { crumbToken } = require('./test-helper')

describe('Legal status page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status'
  }
  const legalStatus = varList.legalStatus

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
      url: `${global.__URLPREFIX__}/legal-status`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message in body if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the legal status of the farm business')
  })

  it('should store user response and redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      payload: { legalStatus, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/country`)
  })

  it('should redirect to ineligible page when lagal staus is others', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/legal-status`,
      payload: { legalStatus: 'None of the above', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
  })
})
