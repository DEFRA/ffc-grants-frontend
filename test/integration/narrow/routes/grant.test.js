describe('Grant page', () => {
  const { crumbToken } = require('./test-helper')

  it('redirects to project-cost if user project-cost has not been saved', async () => {
    const options = {
      method: 'GET',
      url: '/grant'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./project-cost')
  })

  it('redirects to project details page', async () => {
    const postOptions = {
      method: 'POST',
      url: '/grant',
      payload: { crumb: crumbToken, analytics: true },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('./remaining-costs')
  })
})
