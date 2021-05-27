const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data) {
  return {
    backLink: './start',
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
    backLink: './farming-type',
    messageContent:
      'This is only available to farming and horticultural businesses that grow crops for the food industry or nurseries growing ornamentals.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/farming-type',
    handler: (request, h) => {
      const farmingType = getYarValue(request, 'farmingType')
      const data = farmingType || null
      return h.view('farming-type', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/farming-type',
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
        if (request.payload.farmingType !== 'Something else') { return h.redirect('./legal-status') }
        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
