const server = require('./server')

const init = async () => {
  const uploadToSharepointAction = require('./messaging/upload-to-sharepoint')
  require('./messaging/receivers').startFileCreatedReceiver(uploadToSharepointAction)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
