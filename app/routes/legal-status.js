const Joi = require('joi')

function createModel (errorMessage,data) {
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
          text: 'Limited Company',
          checked: !!data && (data.includes('Limited Company'))
        },
        {
          value: 'Partnership',
          text: 'Partnership',
          checked: !!data && (data.includes('Partnership'))
        },
        {
          value: 'Sole trader',
          text: 'Sole trader',
          checked: !!data && (data.includes('Sole trader'))
        },
        {
          value: 'Limited Liability Company',
          text: 'Limited Liability Company',
          checked: !!data && (data.includes('Limited Liability Company'))
        },
        {
          value: 'Trust',
          text: 'Trust',
          checked: !!data && (data.includes('Trust'))
        },
        {
          value: 'Charity',
          text: 'Charity',
          checked: !!data && (data.includes('Charity'))
        },
        {
          value: 'Community Interest Company',
          text: 'Community Interest Company',
          checked: !!data && (data.includes('Community Interest Company'))
        },
        {
          value: 'Public Organisation',
          text: 'Public Organisation',
          checked: !!data && (data.includes('Public Organisation'))
        },
        {
          value: 'Other',
          text: 'Other',
          checked: !!data && (data.includes('Other'))
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
    handler: (request, h) => {
      const legalStatus = request.yar.get('legalStatus');
      const data = !!legalStatus ? legalStatus : null
      return h.view('legal-status', createModel(null,data))
    }
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
        request.yar.set('legalStatus', request.payload.legalStatus)
        return (request.payload.legalStatus === 'Other') ? h.view('./not-eligible', createModelNotEligible()): h.redirect('./project-details')
      }
    }
  }
]
