const Joi = require('joi')

function createModel (errorMessage) {
  return {
    backLink: '/arable',
    radios: {
      classes: 'govuk-radios--inline',
      idPrefix: 'inEngland',
      name: 'inEngland',
      fieldset: {
        legend: {
          text: 'Is the planned project in England?',
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
    backLink: '/country',
    sentences: [
      'This is only for projects in England.',
      'Scotland, Wales and Northern Ireland have similar grants available.'
    ]
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/country',
    handler: (request, h) => h.view('country', createModel(null))
  },
  {
    method: 'POST',
    path: '/country',
    options: {
      validate: {
        payload: Joi.object({
          inEngland: Joi.string().required()
        }),
        failAction: (request, h) => h.view('country', createModel('Select yes if the planned project is in England')).takeover()
      },
      handler: (request, h) => {
        if (request.payload.inEngland === 'yes') {
          request.yar.set('inEngland', request.payload.inEngland)
          return h.redirect('./business')
        }

        return h.view('not-eligible', createModelNotEligible())
      }
    }
  }
]
