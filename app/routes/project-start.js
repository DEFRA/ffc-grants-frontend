const Joi = require('joi')
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

async function createModelNotEligible (request) {
  await gapiService.sendNotEligibleEvent(request)
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
      const projectStarted = request.yar.get('projectStarted')
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
        request.yar.set('projectStarted', request.payload.projectStarted)
        if (request.payload.projectStarted === 'No') {
          return h.redirect('./tenancy')
        }
        const notEligible = await createModelNotEligible(request)
        return h.view('./not-eligible', notEligible)
      }
    }
  }
]
