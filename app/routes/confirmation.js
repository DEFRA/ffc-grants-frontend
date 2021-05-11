const { formatApplicationCode } = require('../helpers/helper-functions')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    if (!request.yar.get('consentMain')) {
      return h.redirect('./start')
    }
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
    await protectiveMonitoringServiceSendEvent(request, request.yar.id, 'FTF-JOURNEY-COMPLETED', '0706')
    await request.ga.event({
      category: 'Confirmation',
      action: `Success-${confirmationId}`
    })
    request.yar.reset()
    return h.view('confirmation', {
      output: {
        titleText: 'Details submitted',
        html: `Your reference number<br><strong>${confirmationId}</strong>`,
        surveyLink: 'https://defragroup.eu.qualtrics.com/jfe/form/SV_e9fFpJ6tySfdHYa'
      }
    })
  }
}
