const server = require('./server')
const appInsights = require('./services/app-insights')

const init = async () => {
  const uploadToSharepointAction = require('./messaging/upload-to-sharepoint')
  require('./messaging/receivers').startFileCreatedReceiver(uploadToSharepointAction)
  appInsights.setup()
  await require('./services/sharepoint').setup()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  appInsights.logException(err, null)
  process.exit(1)
})

init()
