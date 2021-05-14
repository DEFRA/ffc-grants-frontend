// const OLD_ENV = process.env
// const cacheConfig = require('../app/config/cache')
beforeEach(async () => {
  // jest.resetModules()
  // process.env = { ...OLD_ENV }
  // process.env.NODE_ENV = 'test'
  // const Catbox = require('@hapi/catbox')
  // global.__REDIS__ = new Catbox.Client(require('@hapi/catbox-memory'), cacheConfig.catboxOptions)
  // console.log(global.__REDIS__)
  // ...
  // Set reference to server in order to close the server during teardown.
  const createServer = require('../app/server')
  const server = await createServer()
  global.__SERVER__ = server
})
// afterAll(() => {
//   const catbox = require('@hapi/catbox-memory')
//   console.log(catbox)
//   process.env = OLD_ENV
// })
