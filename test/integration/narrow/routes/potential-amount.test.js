const varListTemplate = {
  calculatedGrant: 123,
  projectCost : 122
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
describe('Grant page', () => {

  const { crumbToken } = require('./test-helper')
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('redirect if receive value of calculatedGrant and projectCost', async () => {

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })


  it('redirects to project-cost if user project-cost has not been saved', async () => {
    varList = {
      calculatedGrant: null,
      projectCost : null
    }

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/potential-amount`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/start`)
  })


  it('redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/potential-amount`,
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`remaining-costs`)
  })
})
