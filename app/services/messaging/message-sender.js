const MessageBase = require('./message-base')

class MessageSender extends MessageBase {
  async sendMessage (message) {
    const sender = this.queueClient.createSender()
    try {
      console.log(`---- Class MessageSender.sendMessage() : ${this.name} sending message: `, message)

      await sender.send({ body: message })
      console.log(`---- Class MessageSender.sendMessage() : status OK:  ${this.name}`)
    } catch(err){
      console.error(`---- Class MessageSender.sendMessage() : status ERROR: ${err}`)
    } finally {
      await sender.close()
    }
  }
}

module.exports = MessageSender
