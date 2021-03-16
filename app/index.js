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
}

initialise()
