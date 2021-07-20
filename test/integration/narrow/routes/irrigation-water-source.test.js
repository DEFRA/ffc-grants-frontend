const { crumbToken } = require('./test-helper')

describe('Irrigation water source page', () => {
  const project = ['some fake project']
  const irrigatedCrops = 'some fake crop'
  const irrigatedLandCurrent = '123'
  const irrigatedLandTarget = '456'
  const waterSourceCurrent = ['some source 1']
  const waterSourcePlanned = ['some source 2', 'another source']

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
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should returns error message if no planned water source option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { waterSourceCurrent, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select where your irrigation water will come from')
  })

  it('should store user response and redirects to irrigated crops page', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: { waterSourceCurrent, waterSourcePlanned, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/irrigation-systems`)
  })

  it('should display the error summary if more than two options are selected for each question', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/irrigation-water-source`,
      payload: {
        waterSourceCurrent: ['some option-1', 'some option-2', 'some option-3'],
        waterSourcePlanned: ['another-option-1', 'another-option-2', 'another-option-3'],
        crumb: crumbToken
      },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.payload).toContain('There is a problem')
    expect(postResponse.payload).toContain('Select one or two options to describe your current irrigation water comes from')
    expect(postResponse.payload).toContain('Select one or two options to describe your irrigation water will come from')
  })
})
