
describe('Abstraction caveat page', () => {

  it('should load page successfully (abstraction)', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/abstraction-required-condition`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })
})
