const Joi = require('joi')
const gapiService = require('../services/gapi-service')

function createModel (errorMessage) {
  return {
    backLink: './',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'isArable',
      name: 'isArable',
      fieldset: {
        legend: {
          text: 'Is the planned project for an arable or horticultural farming businesses?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'yes',
          text: 'Yes'
        },
        {
          value: 'no',
          text: 'No'
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: './arable',
    sentences: [
      'This is only for projects for an arable or horticultural farming businesses.'
    ]
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/arable',
    handler: (request, h) => h.view('arable', createModel(null))
  },
  {
    method: 'POST',
    path: '/arable',
    options: {
      validate: {
        payload: Joi.object({
          isArable: Joi.string().required()
        }),
        failAction: (request, h) => h.view('arable', createModel('Select yes if the planned project is for an arable or horticultural farming businesses')).takeover()
      },
      handler: async (request, h) => {
        await gapiService.sendEligibilityEvent(request, request.payload.isArable === 'yes')
        if (request.payload.isArable === 'yes') {
          request.yar.set('isArable', request.payload.isArable)
          return h.redirect('./country')
        }
        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
