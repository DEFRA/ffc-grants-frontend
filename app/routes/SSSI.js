const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

const pageDetails = require('../helpers/page-details')('Q10')

function createModel (errorMessage, data) {
  return {
    backLink: pageDetails.previousPath,
    formActionPage: pageDetails.path,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'sSSI',
      name: 'sSSI',
      fieldset: {
        legend: {
          text: 'Does the project directly impact a Site of Special Scientific Interest?',
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
    path: pageDetails.path,
    handler: (request, h) => {
      const sSSI = getYarValue(request, 'sSSI')
      const data = sSSI || null
      return h.view(pageDetails.template, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          sSSI: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(pageDetails.template, createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'sSSI', request.payload.sSSI)
        await gapiService.sendJourneyTime(request, gapiService.metrics.ELIGIBILITY)
        return h.redirect(pageDetails.nextPath)
      }
    }
  }
]
