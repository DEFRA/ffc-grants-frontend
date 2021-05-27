const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const { LICENSE_EXPECTED, LICENSE_WILL_NOT_HAVE } = require('../helpers/license-dates')

function createModel (backLink, errorMessage, data) {
  return {
    backLink,
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
    path: '/SSSI',
    handler: (request, h) => {
      const abstractionLicence = getYarValue(request, 'abstractionLicence')
      const backLink = (
        abstractionLicence === LICENSE_EXPECTED ||
        abstractionLicence === LICENSE_WILL_NOT_HAVE
      )
        ? './abstraction-caveat'
        : './abstraction-licence'

      const sSSI = getYarValue(request, 'sSSI')
      const data = sSSI || null
      return h.view('SSSI', createModel(backLink, null, data))
    }
  },
  {
    method: 'POST',
    path: '/SSSI',
    options: {
      validate: {
        payload: Joi.object({
          sSSI: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const abstractionLicence = getYarValue(request, 'abstractionLicence')
          const backLink = (
            abstractionLicence === LICENSE_EXPECTED ||
            abstractionLicence === LICENSE_WILL_NOT_HAVE
          )
            ? './abstraction-caveat'
            : './abstraction-licence'

          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('SSSI', createModel(backLink, errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'sSSI', request.payload.sSSI)
        await gapiService.sendJourneyTime(request, gapiService.metrics.ELIGIBILITY)
        return h.redirect('./project-details')
      }
    }
  }
]
