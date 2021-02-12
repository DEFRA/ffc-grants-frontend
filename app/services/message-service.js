const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const config = require('../config').messaging

process.on('SIGTERM', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await messageService.closeConnections()
  process.exit(0)
})

class MessageService {
  constructor (credentials) {
    this.publishEOI = this.publishEOI.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.eoiSender = new MessageSender('eoi-queue-sender', config, credentials)
  }

  async closeConnections () {
    await this.eoiSender.closeConnection()
  }

  async publishEOI (eoi) {
    try {
      return await this.eoiSender.sendMessage(eoi)
    } catch (err) {
      console.log(err)
      throw err
    }
  }
}

let messageService

config.isProd = process.env.NODE_ENV === 'production'

module.exports = (async function createConnections () {
  const credentials = config.isProd ? await auth.loginWithVmMSI({ resource: 'https://servicebus.azure.net' }) : undefined
  messageService = new MessageService(credentials)
  return messageService
}())
