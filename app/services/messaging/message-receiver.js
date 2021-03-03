const MessageBase = require('./message-base')

class MessageReceiver extends MessageBase {
  async receiveMessages (messagesCount) {
    const receiver = this.queueClient.createReceiver(2)
    try {
      console.log(`${this.name} receiving ${messagesCount} message(s)`)

      await receiver.receive(messagesCount)
      console.log(`message received by ${this.name}`)
    } catch(err){
      console.error(`message NOT received: ${err}`)
    } finally {
      await receiver.close()
    }
  }
}

module.exports = MessageReceiver
