const Joi = require('joi')

function createModel (errorMessage,data) {
  return {
    backLink: '/start',
    radios: {
      classes: '',
      idPrefix: 'farmingType',
      name: 'farmingType',
      fieldset: {
        legend: {
          text: 'What crops are you growing?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l'
        }
      },
      items: [
        
        {
          value: 'Crops for the food industry',
          text: 'Crops for the food industry',
          checked: !!data && (data.includes('Crops for the food industry'))
        },
        {
          value: 'Horticulture',
          text: 'Horticulture (including ornamentals)',
          checked: !!data && (data.includes('Horticulture'))
        },
        {
          value: 'Something else',
          text: 'Something else',
          checked: !!data && (data.includes('Something else'))
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: '/farming-type',
    messageContent:
      'This is only available to arable and horticultural farming businesses that supply the food industry, nurseries growing flowers or forestry nurseries.'
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/farming-type',
    handler: (request, h) => {
      const farmingType = request.yar.get('farmingType');
      const data = !!farmingType ? farmingType : null
      return h.view('farming-type', createModel(null,data))
    }
  },
  {
    method: 'POST',
    path: '/farming-type',
    options: {
      validate: {
        payload: Joi.object({
          farmingType: Joi.string().required()
        }),
        failAction: (request, h) => h.view('farming-type', createModel('Please select an option')).takeover()
      },
      handler: (request, h) => {
        request.yar.set('farmingType', request.payload.farmingType)
       return request.payload.farmingType !== 'Something else' ? h.redirect('./legal-status'): h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
