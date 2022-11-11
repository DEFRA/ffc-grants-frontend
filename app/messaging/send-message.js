const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')

const sendMessage = async (body, type, config, options) => {
  const message = createMessage(body, type, options)
  const sender = new MessageSender(config)
  console.log('[MESSAGE MADE]', message)
  try {
    await sender.sendMessage(message)
  } catch (err) {
    console.log('[ERROR THAT IS BEING THROWN]', err)
    throw err
  }
  console.log('[MESSAGE HAS BEEN SENT, CLOSING CONNECTION]')
  await sender.closeConnection()
}

module.exports = sendMessage
