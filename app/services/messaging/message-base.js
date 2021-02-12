const { ServiceBusClient } = require('@azure/service-bus')

class MessageBase {
  constructor (name, config, credentials) {
    this.name = name
    this.sbClient = credentials ? ServiceBusClient.createFromAadTokenCredentials(config.host, credentials) : ServiceBusClient.createFromConnectionString(`Endpoint=sb://${config.host}/;SharedAccessKeyName=${config.username};SharedAccessKey=${config.password}`)
    this.queueClient = this.sbClient.createQueueClient(config.address)
  }

  async closeConnection () {
    await this.sbClient.close()
    console.log(`${this.name} connection closed`)
  }
}

module.exports = MessageBase
