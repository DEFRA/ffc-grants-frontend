const { crumbToken } = require('./test-helper')
describe('Irrigated crops page', () => {
  const project = 'some fake data'
  const irrigatedCrops = 'some crop'

  jest.mock('../../../../app/helpers/session', () => ({
    setYarValue: () => null,
    getYarValue: (request, key) => {
      switch (key) {
        case 'project':
          return [project]
        default:
          return 'Error'
      }
    }
  }))

  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/irrigated-crops',
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
      url: '/irrigated-crops',
      payload: { crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select the main crop you will be irrigating')
  })

  it('should store user response and redirects to irrigated land page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/irrigated-crops',
      payload: { irrigatedCrops, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigated-land')
  })
})
