const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel(errorMessage, data) {
  return {
    backLink: '/farming-type',
    radios: {
      classes: '',
      idPrefix: 'legalStatus',
      name: 'legalStatus',
      fieldset: {
        legend: {
          text: 'What is the legal status of the farm business?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items:
        setLabelData(data, ['Limited Company', 'Partnership', 'Sole trader', 'Limited Liability Company', 'Trust', 'Charity', 'Community Interest Company', 'Public Organisation', 'Other']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible() {
  return {
    backLink: '/legal-status',
    messageContent:
      'This is only open to a business with a legal status of: <ul class="govuk-list govuk-list--bullet"><li>Charity</li><li>Community interest organisation</li><li>Limited company</li><li>Limited liability partnership</li><li>Partnership</li><li>Public organisation</li><li>Sole Trader</li><li>Trust</li></ul><p class="govuk-body">Other types of business may be supported in future schemes.</p>'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/legal-status',
    handler: (request, h) => {
      const legalStatus = request.yar.get('legalStatus')
      const data = legalStatus || null
      return h.view('legal-status', createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: '/legal-status',
    options: {
      validate: {
        payload: Joi.object({
          legalStatus: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('legal-status', createModel(errorMessage)).takeover()
        }
      },
      handler: (request, h) => {
        request.yar.set('legalStatus', request.payload.legalStatus)
        return (request.payload.legalStatus === 'Other') ? h.view('./not-eligible', createModelNotEligible()) : h.redirect('./country')
      }
    }
  }
]
