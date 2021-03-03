const auth = require('@azure/ms-rest-nodeauth')
const MessageSender = require('./messaging/message-sender')
const config = require('../config').sendConfig

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
    this.syncBackEnd = this.syncBackEnd.bind(this)
    this.closeConnections = this.closeConnections.bind(this)
    this.syncSender = new MessageSender('ffc-grants-frontend-oo', config, credentials)
  }

  async closeConnections () {
    await this.syncSender.closeConnection()
  }

  async syncBackEnd (eoi) {
    try {
      return await this.syncSender.sendMessage(eoi)
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
