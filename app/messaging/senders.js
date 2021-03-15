const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')

const projectDetailsSender = new MessageSender(msgCfg.projectDetailsQueue)
const contactDetailsSender = new MessageSender(msgCfg.contactDetailsQueue)

function stop () {
  projectDetailsSender.closeConnection()
  contactDetailsSender.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

async function sendMsg (sender, msgData, correlationId, msgType) {
  const msg = {
    body: msgData,
    type: msgType,
    source: msgCfg.msgSrc,
    correlationId
  }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  sendProjectDetails: function (projectDetailsData, correlationId) {
    sendMsg(projectDetailsSender, projectDetailsData, correlationId, msgCfg.projectDetailsMsgType)
  },
  sendContactDetails: function (contactDetailsData, correlationId) {
    sendMsg(contactDetailsSender, contactDetailsData, correlationId, msgCfg.contactDetailsMsgType)
  }
}
