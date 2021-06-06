const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

const pageDetails = require('../helpers/page-details')('Q1')

function createModel (errorMessage, data) {
  return {
    backLink: pageDetails.previousPath,
    formActionPage: pageDetails.path,
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
    backLink: pageDetails.path,
    messageContent:
      'This grant is only available to<ul class="govuk-list govuk-list--bullet"><li> arable and horticultural farming businesses that supply the food industry</li><li>nurseries growing flowers</li><li>forestry nurseries</li></ul><p class="govuk-body"> <a href=\'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments\'>See other grants you may be eligible for.</a></p>'
  }
}

module.exports = [
  {
    method: 'GET',
    path: pageDetails.path,
    handler: (request, h) => {
      const farmingType = getYarValue(request, 'farmingType')
      const data = farmingType || null
      return h.view(pageDetails.template, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: pageDetails.path,
    options: {
      validate: {
        payload: Joi.object({
          farmingType: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(pageDetails.template, createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'farmingType', request.payload.farmingType)
        await gapiService.sendEligibilityEvent(request, request.payload.farmingType !== 'Something else')
        if (request.payload.farmingType !== 'Something else') { return h.redirect(pageDetails.nextPath) }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
