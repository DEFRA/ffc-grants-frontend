const createServer = require('./server')

process.on('unhandledRejection', (err) => {
  console.log('# Hapi server error')
  console.log(err)
  process.exit(1)
})

const initialise = async () => {
  const server = await createServer()
  await server.start()
  console.log(`# Hapi server started successfully on ${server.info.uri}`)

  const myCache = server.cache({
    cache: 'session',
    expiresIn: 3600 * 1000, // 1 hour
    segment: 'test-segment'
  })

  console.log(`Redis cache is ready to use: ${myCache.isReady()}`)

  const key = 'testing-redis'
  await myCache.set(key, 'A nice value to test Redis cache qqq')

  const value = await myCache.get(key)
  console.log(value)
}

initialise()
