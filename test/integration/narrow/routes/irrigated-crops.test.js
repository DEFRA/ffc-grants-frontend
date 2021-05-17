const { crumbToken } = require('./test-helper')
describe('Irrigated crops page', () => {
  let sessionCookie
  const project = 'Horticulture'
  const irrigatedCrops = 'some crop'

  // jest.mock('../../../../app/helpers/session', () => ({
  //   setYarValue: () => null,
  //   getYarValue: (request, key) => {
  //     switch (key) {
  //       case 'project':
  //         return project
  //       default:
  //         return 'Error'
  //     }
  //   }
  // }))
  const session = require('../../../../app/helpers/session')

  afterAll(() => {
    jest.resetAllMocks()
  })
  it('should load page successfully', async () => {
    // const session = require('../../../../app/helpers/session')
    // injecting project details value
    const postOptions = {
      method: 'POST',
      url: '/project-details',
      payload: { project, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(session.getYarValue(postResponse.request, 'project')).toStrictEqual([project])

    sessionCookie = postResponse.headers['set-cookie']
      .find(line => line.includes('session='))
      .split(' ')
      .find(cookie => cookie.startsWith('session='))

    const options = {
      method: 'GET',
      url: '/irrigated-crops',
      headers: {
        cookie: 'crumb=' + crumbToken + '; ' + sessionCookie
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
        cookie: 'crumb=' + crumbToken + '; ' + sessionCookie
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

  it('should redirects to start page if any previous scoring answer is missing', async () => {
    const postOptions = {
      method: 'GET',
      url: '/irrigated-crops',
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/start')
  })
})
