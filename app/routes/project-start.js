const Joi = require('joi')
const { setLabelData, errorExtractor, getErrorMessage } = require('../helpers/helper-functions')

function createModel (errorMessage, data) {
  return {
    backLink: '/country',
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
    backLink: '/project-start',
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
      handler: (request, h) => {
        request.yar.set('projectStarted', request.payload.projectStarted)
        return request.payload.projectStarted === 'No'
          ? h.redirect('./tenancy')
          : h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
