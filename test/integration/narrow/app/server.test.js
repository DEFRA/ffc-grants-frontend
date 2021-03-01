describe('Server test', () => {
  test('createServer returns server', () => {
    const server = require('../../../../app/server')
    expect(server).toBeDefined()
  })
})
