const { crumbToken } = require('./test-helper')
describe('Collaboration page', () => {
  const project = ['some fake project']
  const irrigatedCrops = 'some fake crop'
  const irrigatedLandCurrent = '123'
  const irrigatedLandTarget = '456'
  const waterSourceCurrent = ['some source 1']
  const waterSourcePlanned = ['some source 2', 'another source']
  const irrigationCurrent = ['some source 2', 'another source']
  const irrigationPlanned = ['some souce 2']
  const productivity = ['some option-1', 'some option-2']
  const collaboration = 'some fake data'

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: (request, key, value) => null,
    getYarValue: (request, key) => {
      switch (key) {
        case 'project':
          return [project]
        case 'irrigatedCrops':
          return irrigatedCrops
        case 'irrigatedLandCurrent':
          return irrigatedLandCurrent
        case 'irrigatedLandTarget':
          return irrigatedLandTarget
        case 'waterSourceCurrent':
          return [waterSourceCurrent]
        case 'waterSourcePlanned':
          return [waterSourcePlanned]
        case 'irrigationCurrent':
          return [irrigationCurrent]
        case 'irrigationPlanned':
          return [irrigationPlanned]
        case 'productivity':
          return [productivity]
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
      url: `${global.__URLPREFIX__}/collaboration`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/collaboration`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if water will be supplied to other farms')
  })

  it('should store user response and redirects to answers page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/collaboration`,
      payload: { crumb: crumbToken, collaboration },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`score`)
  })
})
