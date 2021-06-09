const { crumbToken } = require('./test-helper')

describe('Farming type page', () => {
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/farming-type`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farming-type`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the crops you are growing')
  })

  it('should store user response and redirects to legal status page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farming-type`,
      payload: { farmingType: 'Horticulture', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/legal-status`)
  })

  it('should redirect to ineligible page when farming type is \'Something else\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/farming-type`,
      payload: { farmingType: 'Something else', crumb: crumbToken },
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
