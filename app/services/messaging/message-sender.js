const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  async sendMessage (message) {
    const sender = this.queueClient.createSender()
    try {
      console.log(`${this.name} sending message`, message)

      await sender.send({ body: message })
      console.log(`message sent ${this.name}`)
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
