describe('redirect Page', () => {
  it('should redirect to /start ', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./start')
  })
})
