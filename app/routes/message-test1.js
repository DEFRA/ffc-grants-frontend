const { test: testSender } = require('../messaging/senders')
const { v4: uuid } = require('uuid')
const Wreck = require('@hapi/wreck')

module.exports = [
  {
    method: 'GET',
    path: '/msg-test1',
    handler: (request, h) => {
      request.yar.reset()
      return h.view('message-test1', {})
    }
  },
  {
    method: 'POST',
    path: '/msg-test1',
    handler: async (request, h) => {
      const key = uuid()
      const msg = { body: { key } }
      await testSender(msg)

      let value

      do {
        const url = `http://host.docker.internal:3001/test1?key=${key}`
        const { payload } = await Wreck.get(url, { json: true })
        value = payload.value
      } while (!value)

      request.yar.set('serverMsg1', value)

      return h.redirect('msg-test2')
    }
  }
]
