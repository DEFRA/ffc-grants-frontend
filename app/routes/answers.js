const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')

module.exports = {
  method: 'GET',
  path: '/answers',
  handler: async (request, h) => {
    // Always re-calculate our score before rendering this page
    await senders.sendProjectDetails(createMsg.getDesirabilityAnswers(request), request.yar.id)

    return h.view('answers', {
      output: {
        titleText: 'MEDIUM FIT'
      }
    })
  }
}
