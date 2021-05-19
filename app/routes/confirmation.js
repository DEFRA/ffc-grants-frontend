const { formatApplicationCode } = require('../helpers/helper-functions')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
const { getYarValue } = require('../helpers/session')
const gapiService = require('../services/gapi-service')

module.exports = {
  method: 'GET',
  path: '/confirmation',
  handler: async (request, h) => {
    if (!getYarValue(request, 'consentMain')) {
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

    gapiService.sendDimension(request, {
      category: gapiService.categories.CONFIRMATION,
      url: request.route.path,
      dimension: gapiService.dimensions.CONFIRMATION,
      value: request.yar.id
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
