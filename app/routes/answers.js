const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')

module.exports = {
  method: 'GET',
  path: '/answers',
  handler: async (request, h) => {
    await senders.sendProjectDetails(createMsg.getDesirabilityAnswers(request))

    return h.view('answers', {
      output: {
        titleText: 'MEDIUM FIT'
      }
    })
  }
}
