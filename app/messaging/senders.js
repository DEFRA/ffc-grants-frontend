const msgCfg = require('../config/messaging')
const { MessageSender } = require('ffc-messaging')

const testSender = new MessageSender(msgCfg.testQueue)

async function stop () {
  await testSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, msgType) {
  const msgBase = {
    type: msgType,
    source: msgCfg.msgSrc
  }
  const msg = { ...msgBase, ...msgData }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  test: async function (testData) {
    await sendMsg(testSender, testData, msgCfg.testMsgType)
  }
}
