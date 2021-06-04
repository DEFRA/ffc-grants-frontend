const { crumbToken } = require('./test-helper')
describe('Agent contact details page', () => {
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/agent-contact-details'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter your mobile number')
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@@name.com',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter an email address in the correct format, like name@example.com')
  })

  it('should validate landline (optional) - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        landline: '1234567a90',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate mobile', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        landline: '(123):456789010',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should store user response and redirects to agent address page, title is optional', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@name.com',
        mobile: '07700 900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-address-details')
  })

  it('should store user response and redirects to agent address page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/agent-contact-details',
      payload: {
        email: 'my@name.com',
        landline: '+44 0808 157 0192',
        mobile: '07700 900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./agent-address-details')
  })
})
