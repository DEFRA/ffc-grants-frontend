const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'legal-status'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/farming-type`
const nextPath = `${urlPrefix}/country`

function createModel (errorMessage, data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
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
          'Trust',
          { text: 'Limited liability partnership', value: 'Limited Liability Partnership' },
          { text: 'Community interest company', value: 'Community Interest Company' },
          { text: 'Limited partnership', value: 'Limited Partnership' },
          { text: 'Industrial and provident society', value: 'Industrial and Provident Society' },
          { text: 'Co-operative society (Co-Op)', value: 'Co-operative Society (Co-Op)' },
          { text: 'Community benefit society (BenCom)', value: 'Community Benefit Society (BenCom)' },
          'divider',
          'None of the above'
        ]),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: currentPath,
    messageContent:
      'This is only open to a business with a different legal status.',
    details: {
      summaryText: 'Who is eligible',
      html: '<ul class="govuk-list govuk-list--bullet"><li>Sole trader</li><li>Partnership</li><li>Limited company</li><li>Charity</li><li>Trust</li><li>Limited liability partnership</li><li>Community interest company</li><li>Limited partnership</li><li>Industrial and provident society</li><li>Co-operative society (Co-Op)</li><li>Community benefit society (BenCom)</li></ul>'
    },
    messageLink: {
      url: 'https://www.gov.uk/topic/farming-food-grants-payments/rural-grants-payments',
      title: 'See other grants you may be eligible for.'
    },
    warning: {
      text: 'Other types of business may be supported in future schemes',
      iconFallbackText: 'Warning'
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: currentPath,
    handler: (request, h) => {
      const legalStatus = getYarValue(request, 'legalStatus')
      const data = legalStatus || null
      return h.view(viewTemplate, createModel(null, data))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        payload: Joi.object({
          legalStatus: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view(viewTemplate, createModel(errorMessage)).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'legalStatus', request.payload.legalStatus)
        await gapiService.sendEligibilityEvent(request, request.payload.legalStatus !== 'None of the above')
        if (request.payload.legalStatus === 'None of the above') {
          return h.view('not-eligible', createModelNotEligible())
        }
        return h.redirect(nextPath)
      }
    }
  }
]
