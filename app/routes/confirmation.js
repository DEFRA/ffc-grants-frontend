const { formatApplicationCode } = require('../helpers/helper-functions')
const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
const { getYarValue } = require('../helpers/session')
const gapiService = require('../services/gapi-service')
const { urlPrefix, startPageUrl } = require('../config/server')
const { appInsights } = require('ffc-messaging')

const viewTemplate = 'confirmation'
const currentPath = `${urlPrefix}/${viewTemplate}`
const startPath = startPageUrl

module.exports = {
  method: 'GET',
  path: currentPath,
  handler: async (request, h) => {
    if (!getYarValue(request, 'consentMain')) {
      return h.redirect(startPath)
    }
    const confirmationId = formatApplicationCode(request.yar.id)

    try {
      await senders.sendContactDetails(createMsg.getAllDetails(request, confirmationId), request.yar.id)

      await protectiveMonitoringServiceSendEvent(request, request.yar.id, 'FTF-JOURNEY-COMPLETED', '0706')
      const score = getYarValue(request, 'current-score')
      await gapiService.sendDimensionOrMetrics(request, [{
        dimensionOrMetric: gapiService.dimensions.CONFIRMATION,
        value: confirmationId
      }, {
        dimensionOrMetric: gapiService.dimensions.FINALSCORE,
        value: score
      },
      {
        dimensionOrMetric: gapiService.metrics.CONFIRMATION,
        value: 'TIME'
      }
      ])
      request.yar.reset()
      return h.view(viewTemplate, {
        output: {
          titleText: 'Details submitted',
          html: `Your reference number<br><strong>${confirmationId}</strong>`,
          surveyLink: process.env.SURVEY_LINK,
          confirmationId: confirmationId
        }
      })
    } catch (err) {
      appInsights.logException(null, { error: err })
      await gapiService.sendEvent(request, gapiService.categories.CONFIRMATION, 'Error')
      return h.view('500')
    }
  }
}
