const { crumbToken } = require('./test-helper')
describe('Agent details page', () => {
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/agent-details`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return various error messages if no data is entered', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your first name')
    expect(postResponse.payload).toContain('Enter your last name')
    expect(postResponse.payload).toContain('Enter a business name')
    expect(postResponse.payload).toContain('Enter your email address')
    expect(postResponse.payload).toContain('Enter your building and street details')
    expect(postResponse.payload).toContain('Select your county')
    expect(postResponse.payload).toContain('Enter your postcode, like AA1 1AA')
  })

  it('should validate first name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate last name - no digits', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        lastName: '123',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate bussiness name - no special characters', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        businessName: '$@business',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Name must only include letters, hyphens and apostrophes')
  })

  it('should validate email', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
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

  it('should validate landline - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '12345679a0${',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate mobile correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        mobile: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate landline correct format - if typed in', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        landline: '07700:?$900 982',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192')
  })

  it('should validate postcode - raise error when postcode is invalid', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        postcode: 'aa1aa',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a postcode, like AA1 1AA')
  })

  it('should store user response and redirects to farmer details page, either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'some business',
        email: 'my@name.com',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/farmer-details`)
  })

  it('should store user response and redirects to farmer details page, either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'some business',
        email: 'my@name.com',
        landline: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/farmer-details`)
  })

  it('should store user response and redirects to farmer details page , either of mobile or landline can be empty', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'some business',
        email: 'my@name.com',
        landline: '44 0808 157 0192',
        mobile: '07700 900 982',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe(`${global.__URLPREFIX__}/farmer-details`)
  })

  it('should be validate - if both mobile and landline are missing', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/agent-details`,
      payload: {
        firstName: 'First Name',
        lastName: 'Last Name',
        businessName: 'some business',
        email: 'my@name.com',
        address1: 'Address 1',
        address2: 'Address 2',
        town: 'MyTown',
        county: 'Devon',
        postcode: 'AA1 1AA',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter your mobile number')
    expect(postResponse.payload).toContain('Enter your landline number')
  })
})
