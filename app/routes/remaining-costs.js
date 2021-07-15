const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage, formatUKCurrency } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'remaining-costs'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/potential-amount`
const nextPath = `${urlPrefix}/SSSI`

function createModel (errorMessage, data, formattedRemainingCost) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
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
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    refTitle: 'Remaining costs',
    backLink: currentPath,
    messageContent:
      'You cannot use public money (for example, grant funding from government or local authorities) towards the project costs.',
    insertText: {
      text: 'You can use loans, overdrafts and certain other grants, such as the Basic Payment Scheme or agri-environment schemes such as the Countryside Stewardship Scheme.'
    },
    messageLink: {
      url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
      title: 'See other grants you may be eligible for.'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const payRemainingCosts = getYarValue(request, 'payRemainingCosts') || null
      const remainingCost = getYarValue(request, 'remainingCost') || null
      if (!remainingCost) {
        return h.redirect(`${urlPrefix}/project-cost`)
      }

      const formattedRemainingCost = formatUKCurrency(remainingCost)
      return h.view(viewTemplate, createModel(null, payRemainingCosts, formattedRemainingCost))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          payRemainingCosts: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          gapiService.sendValidationDimension(request)
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          const remainingCost = getYarValue(request, 'remainingCost') || null

          const formattedRemainingCost = formatUKCurrency(remainingCost)
          return h.view(viewTemplate, createModel(errorMessage, null, formattedRemainingCost)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'payRemainingCosts', request.payload.payRemainingCosts)
        await gapiService.sendEligibilityEvent(request, request.payload.payRemainingCosts === 'Yes')
        if (request.payload.payRemainingCosts === 'Yes') {
          return h.redirect(nextPath)
        }
        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
