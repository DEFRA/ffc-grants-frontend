const Joi = require('joi')

function createModel (backLink, errorMessage) {
  return {
    backLink: `/${backLink}`,
    actionLink: '/save-progress',
    radios: {
      idPrefix: 'saveProgress',
      name: 'saveProgress',
      fieldset: {
        legend: {
          text: 'How would you like to return to your application?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'email',
          text: 'Send me an email with a link'
        },
        {
          value: 'reference',
          text: 'Get a reference code'
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/save-progress',
    handler: (request, h) => h.view('save-progress', createModel(request.query.back, null))
  },
  {
    method: 'POST',
    path: '/save-progress',
    options: {
      validate: {
        payload: Joi.object({
          saveProgress: Joi.string().required()
        }),
        failAction: (request, h) => h.view('save-progress', createModel('Select how you wish to return to return to your application')).takeover()
      },
      handler: (request, h) => {
        if (request.payload.saveProgress === 'email') {
          return h.redirect('./email')
        }

        return h.redirect('./progress-reference')
      }
    }
  }
]
