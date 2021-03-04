const { test: testSender } = require('../messaging/senders')
const { v4: uuid } = require('uuid')
const Wreck = require('@hapi/wreck')

async function getResult (key) {
  const url = `http://host.docker.internal:3001/test1?key=${key}`

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const response = await Wreck.get(url, { json: true })

    if (response.res.statusCode !== 202) {
      console.log(response.payload.value)
      return response.payload.value
    }
  }
}

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

      const value = await getResult(key)
      request.yar.set('serverMsg1', value)

      return h.redirect('msg-test2')
    }
  }
]
