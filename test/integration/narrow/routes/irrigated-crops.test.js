const { crumbToken } = require('./test-helper')
describe('Irrigated crops page', () => {
  let sessionCookie = ''
  it('should load page successfully', async () => {
    // injecting project details value
    const postOptions = {
      method: 'POST',
      url: '/project-details',
      payload: { project: 'some fake proj', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)

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
      payload: { irrigatedCrops: 'some crop', crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./irrigated-land')
  })

  it('should redirects to istart page if any previous scoring answer is missing', async () => {
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
