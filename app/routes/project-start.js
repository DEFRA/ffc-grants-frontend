const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage, data) {
  return {
    backLink: './country',
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

function createModelNotEligible () {
  return {
    backLink: './project-start',
    messageContent:
      'Only projects that have not yet started can apply for a grant.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-start',
    handler: (request, h) => {
      const projectStarted = getYarValue(request, 'projectStarted')
      const data = projectStarted || null
      return h.view('project-start', createModel(null, data))
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
          return h.view('project-start', createModel(errorMessage)).takeover()
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
