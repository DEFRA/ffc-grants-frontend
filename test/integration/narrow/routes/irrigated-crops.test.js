const { crumbToken } = require('./test-helper')
describe('Irrigated crops page', () => {
  const varListTemplate = {
    project: 'some fake data',
    irrigatedCrops: 'some crop',
    'current-score': null
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

  beforeEach(() => {
    jest.resetAllMocks()
    varList = { ...varListTemplate }
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-crops`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page with no yar successfully', async () => {
    varList = {
      irrigatedCrops: null,
      'current-score': null
    }
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/irrigated-crops`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-crops`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the main crop you will be irrigating')
  })

  it('should store user response and redirects to irrigation status page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-crops`,
      payload: { irrigatedCrops: 'some fake data', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('irrigated-land')
  })

  it('should store user response and redirects to score', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigated-crops`,
      payload: { irrigatedCrops: 'some fake data', results: 'Back to score', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/score`)
  })
})
