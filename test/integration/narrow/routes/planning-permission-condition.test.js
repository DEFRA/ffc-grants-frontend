const { crumbToken } = require('./test-helper')

describe('Page: /planning-permission-condition', () => {
  const varList = { inEngland: 'randomData', 'current-score': null }

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  it('user select continue on conditional page redirect to project-start', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/planning-permission-condition`,
      headers: { cookie: 'crumb=' + crumbToken },
      payload: { crumb: crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('project-start')
  })

  it('should load the condition page with correct heading', async () => {
    const getOptions = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const getResponse = await global.__SERVER__.inject(getOptions)
    expect(getResponse.statusCode).toBe(200)
    expect(getResponse.payload).toContain('You may be able to apply for a grant from this scheme')
  })
  it('page loads with correct back link', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/planning-permission-condition`
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
    expect(response.payload).toContain('<a href=\"planning-permission\" class=\"govuk-back-link\"')
  })
})
