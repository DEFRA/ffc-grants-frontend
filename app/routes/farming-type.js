const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const { urlPrefix, startPageUrl } = require('../config/server')

const viewTemplate = 'farming-type'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = startPageUrl
const nextPath = `${urlPrefix}/legal-status`

function createModel (errorMessage, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    radios: {
      classes: '',
      idPrefix: 'farmingType',
      name: 'farmingType',
      fieldset: {
        legend: {
          text: 'What crops are you growing?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Crops for the food industry', 'Horticulture (including ornamentals)', 'Something else']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    refTitle: 'Farming type',
    backLink: currentPath,
    messageContent:
      'This grant is only available to:<ul class="govuk-list govuk-list--bullet"><li> arable and horticultural farming businesses that supply the food industry</li><li>nurseries growing ornamentals</li><li>forestry nurseries</li></ul><p class="govuk-body"> <a class="govuk-link" href=\'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments\'>See other grants you may be eligible for.</a></p>'
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      setYarValue(request, 'journey-start-time', Date.now())
      const farmingType = getYarValue(request, 'farmingType')
      const data = farmingType || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          farmingType: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'farmingType', request.payload.farmingType)
        await gapiService.sendEligibilityEvent(request, request.payload.farmingType !== 'Something else')

        if (request.payload.farmingType !== 'Something else') {
          return h.redirect(nextPath)
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
