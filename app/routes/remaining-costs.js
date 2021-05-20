const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage, formatUKCurrency } = require('../helpers/helper-functions')

function createModel(errorMessage, data, formattedRemainingCost) {
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

function createModelNotEligible() {
  return {
    backLink: './remaining-costs',
    messageContent:
      'It is not possible to use public money towards the project costs when applying for a grant.'
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
      handler: (request, h) => {
        setYarValue(request, 'payRemainingCosts', request.payload.payRemainingCosts)
        return request.payload.payRemainingCosts === 'Yes'
          ? h.redirect('./planning-permission')
          : h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
