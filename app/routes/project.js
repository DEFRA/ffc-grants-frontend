const Joi = require('joi')

function createModel (errorMessage, errorSummary, data) {
  return {
    backLink: '/legal-status',
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
      items: [
        {
          value: 'Introduce irrigation',
          text: 'Introduce irrigation',
          checked: !!data && (data.includes('Introduce irrigation'))
        },
        {
          value: 'Increase irrigation',
          text: 'Increase irrigation',
          checked: !!data && (data.includes('Increase irrigation'))
        },
        {
          value: 'Improve irrigation efficiency',
          text: 'Improve irrigation efficiency',
          checked: !!data && (data.includes('Improve irrigation efficiency'))
        },
        {
          value: 'Change water source',
          text: 'Change water source',
          checked: !!data && (data.includes('Change water source'))
        }
      ],
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

      return h.view('project', createModel(null, null, data))
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
          h
            .view('project', createModel('Please select an option', null, null))
            .takeover()
      },
      handler: (request, h) => {
        if (Array.isArray(request.payload.project) && request.payload.project.length > 2) {
          return h
            .view(
              'project',
              createModel(
                'Only one or two selections are allowed',
                'Only one or two selections are allowed',
                null
              ))
            .takeover()
        }

        request.yar.set('project', request.payload.project)
        return h.redirect('./irrigated-crops')
      }
    }
  }
]
