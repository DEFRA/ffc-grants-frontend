const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'irrigation-status'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-crops`
const nextPath = `${urlPrefix}/irrigated-land`

function createModel (errorMessage, data, hasScore) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'currentlyIrrigating',
      name: 'currentlyIrrigating',
      fieldset: {
        legend: {
          text: 'Are you currently irrigating?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

      if (getYarValue(request, 'current-score')) {
        return h.redirect(`${urlPrefix}/irrigated-crops`)
      }

      return h.view(viewTemplate, createModel(null, currentlyIrrigating, getYarValue(request, 'current-score')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          currentlyIrrigating: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        const { currentlyIrrigating } = request.payload
        setYarValue(request, 'currentlyIrrigating', currentlyIrrigating)

        await gapiService.sendJourneyTime(request, gapiService.metrics.ELIGIBILITY)
        return h.redirect(nextPath)
      }
    }
  }
]
