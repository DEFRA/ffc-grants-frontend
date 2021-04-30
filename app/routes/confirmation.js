const { formatApplicationCode } = require('../helpers/helper-functions')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    const confirmationId = formatApplicationCode(request.yar.id)
    try {
      await senders.sendContactDetails(createMsg.getAllDetails(request, confirmationId), request.yar.id)
    } catch (err) {
      await request.ga.event({
        category: 'Confirmation',
        action: 'Error'
      })
      return h.view('500')
    }
    await request.ga.event({
      category: 'Confirmation',
      action: 'Success'
    })
    return h.view('confirmation', {
      output: {
        titleText: 'Details submitted',
        html: `Your reference number<br><strong>${confirmationId}</strong>`,
        surveyLink: 'https://defragroup.eu.qualtrics.com/jfe/form/SV_e9fFpJ6tySfdHYa'
      }
    })
  }
}
