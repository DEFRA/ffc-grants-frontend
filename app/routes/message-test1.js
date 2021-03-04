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

      let value, statusCode

      do {
        const url = `http://host.docker.internal:3001/test1?key=${key}`
        const response = await Wreck.get(url, { json: true })
        value = response.payload.value
        statusCode = response.res.statusCode
      } while (statusCode === 202)

      request.yar.set('serverMsg1', value)

      return h.redirect('msg-test2')
    }
  }
]
