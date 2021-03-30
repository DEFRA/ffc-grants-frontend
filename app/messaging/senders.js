const { MessageSender } = require('ffc-messaging')
const msgCfg = require('../config/messaging')

const eligibilityAnswersSender = new MessageSender(msgCfg.eligibilityAnswersQueue)
const projectDetailsSender = new MessageSender(msgCfg.projectDetailsQueue)
const contactDetailsSender = new MessageSender(msgCfg.contactDetailsQueue)

async function stop () {
  await eligibilityAnswersSender.closeConnection()
  await projectDetailsSender.closeConnection()
  await contactDetailsSender.closeConnection()
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
  const msg = {
    body: msgData,
    type: msgType,
    source: msgCfg.msgSrc
  }

  console.log('sending message', msg)

  await sender.sendMessage(msg)
}

module.exports = {
  sendProjectDetails: async function (projectDetailsData) {
    await sendMsg(projectDetailsSender, projectDetailsData, msgCfg.projectDetailsMsgType)
  },
  sendContactDetails: async function (contactDetailsData) {
    await sendMsg(contactDetailsSender, contactDetailsData, msgCfg.contactDetailsMsgType)
  }
}
