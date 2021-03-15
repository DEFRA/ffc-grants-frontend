const senders = require('../messaging/senders')

function createModel () {
  return {
    button: {
      text: 'Start now',
      nextLink: '/farming-type'
    }
  }
}

module.exports = {
  method: 'GET',
  path: '/start',
  handler: async (request, h) => {
    request.yar.reset()

    console.log(request.yar.id)
    await senders.sendProjectDetails({ test: 'test message' }, request.yar.id)

    return h.view('home', createModel())
  }
}
