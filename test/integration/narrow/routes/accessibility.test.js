describe('Accessibility Statement', () => {
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility'
    }
    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
