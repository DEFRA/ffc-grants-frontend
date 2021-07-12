const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const { createModelTwoRadios } = require('../helpers/modelTwoRadios')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'irrigation-status'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/irrigated-crops`
const nextPath = `${urlPrefix}/irrigated-land`

const prefixModelParams = [
  previousPath, currentPath, 'Yes', 'No', 'currentlyIrrigating', 'currentlyIrrigating', 'Are you currently irrigating?'
]

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const currentlyIrrigating = getYarValue(request, 'currentlyIrrigating') || null

      if (getYarValue(request, 'current-score')) {
        return h.redirect(`${urlPrefix}/irrigated-crops`)
      }

      return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, null, currentlyIrrigating))
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
          return h.view(viewTemplate, createModelTwoRadios(...prefixModelParams, errorMessage)).takeover()
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
