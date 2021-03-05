const server = require('./server')

const init = async () => {
  const fileCreatedReceivedAction = require('./messaging/upload-to-sharepoint')
  require('./messaging/receivers').startFileCreatedReceived(fileCreatedReceivedAction)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
