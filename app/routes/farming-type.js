const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data) {
  return {
    backLink: '/water/start',
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
    backLink: '/water/farming-type',
    messageContent:
      'This grant is only available to<ul class="govuk-list govuk-list--bullet"><li> arable and horticultural farming businesses that supply the food industry</li><li>nurseries growing flowers</li><li>forestry nurseries</li></ul><p class="govuk-body"> <a href=\'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments\'>See other grants you may be eligible for.</a></p>'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/water/farming-type',
    handler: (request, h) => {
      const farmingType = getYarValue(request, 'farmingType')
      const data = farmingType || null
      return h.view('farming-type', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/water/farming-type',
    options: {
      validate: {
        payload: Joi.object({
          farmingType: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('farming-type', createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'farmingType', request.payload.farmingType)
        await gapiService.sendEligibilityEvent(request, request.payload.farmingType !== 'Something else')
        if (request.payload.farmingType !== 'Something else') { return h.redirect('/water/legal-status') }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
