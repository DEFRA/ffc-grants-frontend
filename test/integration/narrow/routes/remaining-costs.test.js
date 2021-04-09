describe('Remaining costs page', () => {
  const crumToken = 'ZRGdpjoumKg1TQqbTgTkuVrNjdwzzdn1qKt0lR0rYXl'
  let server
  const createServer = require('../../../../app/server')

  beforeEach(async () => {
    server = await createServer()
    await server.start()
  })

  it('should load page successfully', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Can you pay the remaining costs of')
  })

  it('redirects to /project-cost if projectCost value has not been saved', async () => {
    const options = {
      method: 'GET',
      url: '/remaining-costs',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./project-cost')
  })

  it('should return an error message if no option is selected', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Select yes if you can pay the remaining costs without using any other grant money')
  })

  it('user selects NO -> show elimination message', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { payRemainingCosts: 'No', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('user selects YES -> store valid user input and redirect to planning-permission', async () => {
    const postOptions = {
      method: 'POST',
      url: '/remaining-costs',
      payload: { payRemainingCosts: 'Yes', crumb: crumToken },
      headers: { cookie: 'crumb=' + crumToken }
    }

    const postResponse = await server.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./planning-permission')
  })

  afterEach(async () => {
    await server.stop()
  })
})
