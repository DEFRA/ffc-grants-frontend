const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data) {
  return {
    backLink: './farming-type',
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
        setLabelData(data, [
          { text: 'Sole trader', value: 'Sole Trader' },
          'Partnership',
          { text: 'Limited company', value: 'Ltd Company' },
          'Charity',
          { text: 'Public organisation', value: 'Public Organisation' },
          'Trust',
          { text: 'Limited liability partnership', value: 'Limited Liability Partnership' },
          { text: 'Community interest company', value: 'Community Interest Company' },
          { text: 'Local authority', value: 'Local Authority' },
          { text: 'Limited partnership', value: 'Limited Partnership' },
          { text: 'Industrial and provident society', value: 'Industrial and Provident Society' },
          { text: 'Co-operative society (Co-Op)', value: 'Co-operative Society (Co-Op)' },
          { text: 'Community benefit society (BenCom)', value: 'Community Benefit Society (BenCom)' },
          'None of the above'
        ]),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: './legal-status',
    messageContent:
      'This is only open to a business with a legal status of: <ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Ltd company</li><li>Charity</li><li>Public organisation</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Local authority</li></ul> <p class="govuk-body">Other types of business may be supported in future schemes.</p>'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/legal-status',
    handler: (request, h) => {
      const legalStatus = getYarValue(request, 'legalStatus')
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
      handler: async (request, h) => {
        setYarValue(request, 'legalStatus', request.payload.legalStatus)
        await gapiService.sendEligibilityEvent(request, request.payload.legalStatus !== 'None of the above')
        if (request.payload.legalStatus === 'None of the above') {
          return h.view('./not-eligible', createModelNotEligible())
        }
        return h.redirect('./country')
      }
    }
  }
]
