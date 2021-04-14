const { formatApplicationCode } = require('../helpers/helper-functions')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')

module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    const confirmationId = formatApplicationCode(request.yar.id)
    try {
      await senders.sendContactDetails(createMsg.getContactDetails(request, confirmationId), request.yar.id)
    } catch (err) {
      return h.view('500')
    }

    return h.view('confirmation', {
      output: {
        titleText: 'Details submitted',
        html: `Your reference number<br><strong>${confirmationId}</strong>`,
        surveyLink: '#'
      }
    })
  }
}
