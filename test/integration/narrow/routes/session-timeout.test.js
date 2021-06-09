describe('Session time out page', () => {
  it('should load page successfully ', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/session-timeout`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
