const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')
const { LICENSE_EXPECTED } = require('../helpers/license-dates')
function createModel (errorMessage, data, backLink) {
  return {
    backLink: backLink,
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'projectStarted',
      name: 'projectStarted',
      fieldset: {
        legend: {
          text: 'Have you already started work on the project?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: setLabelData(data, ['Yes', 'No']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

const getBackLink = (request) => {
  const planningPermission = getYarValue(request, 'planningPermission')
  return (planningPermission === LICENSE_EXPECTED)
    ? './planning-required-condition'
    : './planning-permission'
}

function createModelNotEligible () {
  return {
    backLink: './project-start',
    messageContent:
      'You cannot apply for a grant if you have already started work on the project. <br/>Starting the project or committing to any costs (such as placing orders) before you receive a funding agreement invalidates your application.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-start',
    handler: (request, h) => {
      const projectStarted = getYarValue(request, 'projectStarted')
      const data = projectStarted || null
      return h.view('project-start', createModel(null, data, getBackLink(request)))
    }
  },
  {
    method: 'POST',
    path: '/project-start',
    options: {
      validate: {
        payload: Joi.object({
          projectStarted: Joi.string().required()
        }),
        failAction: (request, h, err) => {
          const errorObject = errorExtractor(err)
          const errorMessage = getErrorMessage(errorObject)
          return h.view('project-start', createModel(errorMessage, null, getBackLink(request))).takeover()
        }
      },
      handler: async (request, h) => {
        setYarValue(request, 'projectStarted', request.payload.projectStarted)
        await gapiService.sendEligibilityEvent(request, request.payload.projectStarted === 'No')
        if (request.payload.projectStarted === 'No') {
          return h.redirect('./tenancy')
        }
        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
