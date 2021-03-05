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
          checked: isChecked(data,'Limited Company')
        },
        {
          value: 'Partnership',
          text: 'Partnership',
          checked: isChecked(data,'Partnership')
        },
        {
          value: 'Sole trader',
          text: 'Sole trader',
          checked: isChecked(data,'Sole trader')
        },
        {
          value: 'Limited Liability Company',
          text: 'Limited Liability Company',
          checked: isChecked(data,'Limited Liability Company')
        },
        {
          value: 'Trust',
          text: 'Trust',
          checked: isChecked(data,'Trust')
        },
        {
          value: 'Charity',
          text: 'Charity',
          checked: isChecked(data,'Charity')
        },
        {
          value: 'Community Interest Company',
          text: 'Community Interest Company',
          checked: isChecked(data,'Community Interest Company')
        },
        {
          value: 'Public Organisation',
          text: 'Public Organisation',
          checked: isChecked(data,'Public Organisation')
        },
        {
          value: 'Other',
          text: 'Other',
          checked: isChecked(data,'Other')
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}
function isChecked(data,option) {
  return !!data && (data.includes(option))
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
