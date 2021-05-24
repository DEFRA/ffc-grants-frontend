const Joi = require('joi')
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

async function createModelNotEligible (request) {
  await gapiService.sendNotEligibleEvent(request)
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
      const payRemainingCosts = request.yar.get('payRemainingCosts') || null
      const remainingCost = request.yar.get('remainingCost') || null

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
          const remainingCost = request.yar.get('remainingCost') || null

          const formattedRemainingCost = formatUKCurrency(remainingCost)
          return h.view('remaining-costs', createModel(errorMessage, null, formattedRemainingCost)).takeover()
        }
      },
      handler: async (request, h) => {
        request.yar.set('payRemainingCosts', request.payload.payRemainingCosts)
        if (request.payload.payRemainingCosts === 'Yes') {
          return h.redirect('./planning-permission')
        }
        const notEligible = await createModelNotEligible(request)
        return h.view('./not-eligible', notEligible)
      }
    }
  }
]
