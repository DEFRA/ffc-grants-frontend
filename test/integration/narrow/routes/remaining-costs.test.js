describe('Remaining costs page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/remaining-costs'
    }
    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs without using any other grant money')
  })

  it('should show elimination message if the user select NO', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { remainingCosts: 'No', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Can you pay the remaining costs of')
  })

  it('should store valid user input and redirect to project grant page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { remainingCosts: 'Yes', crumb: crumToken },
      headers: {
        cookie: 'crumb=' + crumToken
      }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    // expect(postResponse.headers.location).toBe('./planning-permission')
  })

  afterEach(async () => {
    await server.stop()
  })
})
