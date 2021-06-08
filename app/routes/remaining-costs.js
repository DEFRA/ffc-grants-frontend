const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage, formatUKCurrency } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data, formattedRemainingCost) {
  return {
    backLink: './project-cost',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'payRemainingCosts',
      name: 'payRemainingCosts',
      fieldset: {
        legend: {
          text: `Can you pay the remaining costs of £${formattedRemainingCost}?`,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        html: 'You cannot use any grant funding from government or local authorities. You can use money from the Basic Payment Scheme or agri-environment schemes such as Countryside Stewardship Scheme.</br><br/>'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: './remaining-costs',
    messageContent:
      'You cannot use public money (for example grant funding from government or local authorities) towards the project costs.<br/><br/>You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.',
    messageLink: {
      url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
      title: 'See other grants you may be eligible for.'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/remaining-costs',
    handler: (request, h) => {
      const payRemainingCosts = getYarValue(request, 'payRemainingCosts') || null
      const remainingCost = getYarValue(request, 'remainingCost') || null
      if (!remainingCost) {
        return h.redirect('./project-cost')
      }

      const formattedRemainingCost = formatUKCurrency(remainingCost)
      return h.view('remaining-costs', createModel(null, payRemainingCosts, formattedRemainingCost))
    }
  },
  {
    method: 'POST',
    path: '/remaining-costs',
    options: {
      validate: {
        payload: Joi.object({
          payRemainingCosts: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          const remainingCost = getYarValue(request, 'remainingCost') || null

          const formattedRemainingCost = formatUKCurrency(remainingCost)
          return h.view('remaining-costs', createModel(errorMessage, null, formattedRemainingCost)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'payRemainingCosts', request.payload.payRemainingCosts)
        await gapiService.sendEligibilityEvent(request, request.payload.payRemainingCosts === 'Yes')
        if (request.payload.payRemainingCosts === 'Yes') {
          return h.redirect('./SSSI')
        }
        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
