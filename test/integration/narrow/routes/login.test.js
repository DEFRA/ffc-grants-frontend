const { crumbToken } = require('./test-helper')

describe('Login page', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it.skip('Should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/login`,
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should not authentic if incorrect details provided', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/login`,
      payload: { username: 'some conscent', password: 'password', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the username and password you&#39;ve been given')

  })
})