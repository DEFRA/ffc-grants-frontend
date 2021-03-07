const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let fileCreatedReceiver

async function stop () {
  await fileCreatedReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  startFileCreatedReceiver: async function (fileCreatedReceived) {
    const updateAction = msg => fileCreatedReceived(msg, fileCreatedReceiver)
    fileCreatedReceiver = new MessageReceiver(msgCfg.fileCreatedSubscription, updateAction)
    await fileCreatedReceiver.subscribe()
  }
}
