const Joi = require('joi')

function createModel(errorMessage) {
  return {
    backLink: '/farming-type',
    radios: {
      classes: '',
      idPrefix: 'legalStatus',
      name: 'legalStatus',
      fieldset: {
        legend: {
          text: 'What is the legal status of the farm business?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        {
          value: 'Limited Company',
          text: 'Limited Company'
        },
        {
          value: 'Partnership',
          text: 'Partnership'
        },
        {
          value: 'Sole trader',
          text: 'Sole trader'
        },
        {
          value: 'Limited Liability Company',
          text: 'Limited Liability Company'
        },
        {
          value: 'Trust',
          text: 'Trust'
        },
        {
          value: 'Charity',
          text: 'Charity'
        },
        {
          value: 'Community Interest Company',
          text: 'Community Interest Company'
        },
        {
          value: 'Public Organisation',
          text: 'Public Organisation'
        },
        {
          value: 'Other',
          text: 'Other'
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible() {
  return {
    backLink: '/legal-status',
    sentences: [
      'This is only open to a business with a legal status of:',
      '\n\u2022 Charity',
      '\n\u2022 Community interest organisation',
      '\n\u2022 Limited company',
      '\n\u2022 Limited liability partnership',
      '\n\u2022 Partnership',
      '\n\u2022 Public organisation',
      '\n\u2022 Sole Trader',
      '\n\u2022 Trust',
      'Other types of business may be supported in future schemes.'
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
          legalStatus: Joi.string().required()
        }),
        failAction: (request, h) => h.view('legal-status', createModel('Select one option')).takeover()
      },
      handler: (request, h) => {
        if (request.payload.legalStatus === 'Other') {
          return h.view('./not-eligible', createModelNotEligible())

        }
        request.yar.set('legalStatus', request.payload.legalStatus)
        return h.redirect('./project')
      }
    }
  }
]
