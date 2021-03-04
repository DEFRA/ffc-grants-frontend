const Joi = require('joi')

function createModel (errorMessage) {
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

function createModelNotEligible () {
  return {
    backLink: '/legal-status',
    messageContent:
      'This is only open to a business with a legal status of: <ul class="govuk-list govuk-list--bullet"><li>Charity</li><li>Community interest organisation</li><li>Limited company</li><li>Limited liability partnership</li><li>Partnership</li><li>Public organisation</li><li>Sole Trader</li><li>Trust</li></ul><p class="govuk-body">Other types of business may be supported in future schemes.</p>'
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
        failAction: (request, h) =>
          h.view('legal-status', createModel('Select one option')).takeover()
      },
      handler: (request, h) => {
        if (request.payload.legalStatus === 'Other') {
          return h.view('./not-eligible', createModelNotEligible())
        }
        request.yar.set('legalStatus', request.payload.legalStatus)
        return h.redirect('./project-details')
      }
    }
  }
]
