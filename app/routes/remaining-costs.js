const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel(errorMessage, data) {
  return {
    backLink: '/project-cost',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'remainingCosts',
      name: 'remainingCosts',
      fieldset: {
        legend: {
          text: 'Can you pay the remaining costs of £(value)?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      hint: {
        text:'You cannot use any grant funding from government or local authorities. You can use money from the Basic Payment Scheme or agri-environment schemes such as Countryside Stewardship Scheme.'
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: '/remaining-costs',
    messageContent:
      'It is not possible to use public money towards the project costs when applying for a grant.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/remaining-costs',
    handler: (request, h) => {
      const remainingCosts = request.yar.get('remainingCosts') || null
      return h.view('remaining-costs', createModel(null, remainingCosts))
    }
  },
  {
    method: 'POST',
    path: '/remaining-costs',
    options: {
      validate: {
        payload: Joi.object({
          remainingCosts: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('remaining-costs', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('remainingCosts', request.payload.remainingCosts)
        return request.payload.remainingCosts === 'Yes'
          ? h.redirect('./project-details')// /planning-permission
          : h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
