const { crumbToken } = require('./test-helper')

describe('Irrigation syatems page', () => {
  const project = ['some fake project']
  const irrigatedCrops = 'some fake crop'
  const irrigatedLandCurrent = '123'
  const irrigatedLandTarget = '456'
  const waterSourceCurrent = ['some source 1']
  const waterSourcePlanned = ['some source 2', 'another source']
  const irrigationCurrent = ['some source 2', 'another source']
  const irrigationPlanned = ['some souce 2']

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
      url: `${global.__URLPREFIX__}/irrigation-systems`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no water system option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select one or two systems currently used to irrigate')
    expect(postResponse.payload).toContain('Select one or two systems that will be used to irrigate')
  })

  it('should store user response and redirects to productivity page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: { irrigationCurrent, irrigationPlanned, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/productivity`)
  })

  it('should display the error summary if more than two options are selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-systems`,
      payload: {
        irrigationCurrent: ['some option-1', 'some option-2', 'some option-3'],
        irrigationPlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select a maximum of two systems currently used to irrigate')
    expect(postResponse.payload).toContain('Select a maximum of two systems that will be used to irrigate')
  })
})
