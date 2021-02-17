const Joi = require('joi')

function createModel (errorMessage) {
  return {
    backLink: '/farming-type',
    radios: {
      classes: '',
      idPrefix: 'isArable',
      name: 'isArable',
      fieldset: {
        legend: {
          text: 'What is the legal status of the farm business?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'Charity',
          text: 'Charity'
        },
        {
          value: 'Community interest organisation',
          text: 'Community interest organisation'
        },
        {
          value: '...',
          text: '...'
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: '/legal-status',
    sentences: [
      'This is only for projects for an arable or horticultural farming businesses.'
    ]
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/legal-status',
    handler: (request, h) => h.view('legal-status', createModel(null))
  },
  {
    method: 'POST',
    path: '/legal-status',
    options: {
      validate: {
        payload: Joi.object({
          isArable: Joi.string().required()
        }),
        failAction: (request, h) => h.view('legal-status', createModel('Select yes if the planned project is for an arable or horticultural farming businesses')).takeover()
      },
      handler: (request, h) => {
        if (request.payload.isArable === 'yes') {
          request.yar.set('isArable', request.payload.isArable)
          return h.redirect('./country')
        }

        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
