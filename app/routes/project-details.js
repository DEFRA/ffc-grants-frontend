const Joi = require('joi')
const { setLabelData } = require('../helpers/helper-functions')

function createModel (errorMessage, errorSummary, data) {
  return {
    backLink: '/tenancy',
    ...(errorSummary ? { errorText: errorSummary } : {}),
    checkboxes: {
      idPrefix: 'project',
      name: 'project',
      fieldset: {
        legend: {
          text: 'The project will:',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m'
        }
      },
      items: setLabelData(data, ['Change water source', 'Improve irrigation efficiency', 'Increase irrigation', 'Introduce irrigation']),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/project-details',
    handler: (request, h) => {
      const project = request.yar.get('project')
      const data = project || null

      return h.view('project-details', createModel(null, null, data))
    }
  },
  {
    method: 'POST',
    path: '/project-details',
    options: {
      validate: {
        payload: Joi.object({
          project: Joi.any().required()
        }),
        failAction: (request, h) =>
          h.view('project-details', createModel('Please select an option', null, null)).takeover()
      },
      handler: (request, h) => {
        let { project } = request.payload
        project = [project].flat()

        if (project.length > 2) {
          return h.view('project-details', createModel('Only one or two selections are allowed', 'Only one or two selections are allowed', project)).takeover()
        }

        request.yar.set('project', project)
        return h.redirect('./irrigated-crops')
      }
    }
  }
]
