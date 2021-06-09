const { crumbToken } = require('./test-helper')

describe('Country Page', () => {
  const varList = {
    farmingType: 'some fake crop',
    legalStatus: 'fale status',
    inEngland: 'Yes'
  }
  const inEngland = varList.inEngland

  let server
  const createServer = require('../../../../app/server')

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      if (Object.keys(varList).includes(key)) return varList[key]
      else return 'Error'
    }
  }))

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should load country page sucessfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/country`
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { projectPostcode: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if the project is in England')
  })

  it('should returns error message if postcode is not entered for selected yes option ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { inEngland, projectPostcode: '', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a postcode, like AA1 1AA')
  })

  it('should returns error message if postcode is not in the correct format ', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { inEngland, projectPostcode: 'AB123 4CD', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a postcode, like AA1 1AA')
  })

  it('should store user response and redirects to planning permission page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { inEngland, projectPostcode: 'XX1 5XX', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/planning-permission`)
  })

  it('should display ineligible page when user response is \'No\'', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/country`,
      payload: { projectPostcode: '', inEngland: 'No', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.payload).toContain(
      'You cannot apply for a grant from this scheme'
    )
  })

  afterEach(async () => {
    await server.stop()
  })
})
