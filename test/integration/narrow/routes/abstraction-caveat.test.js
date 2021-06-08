
describe('Abstraction caveat page', () => {
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: '/planning-required-condition'
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
