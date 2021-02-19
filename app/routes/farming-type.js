const Joi = require('joi')

function createModel (errorMessage) {
  return {
    backLink: '/',
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
          text: 'Crops for the food industry'
        },
        {
          value: 'Horticulture',
          text: 'Horticulture (including ornamentals)'
        },
        {
          value: 'Something else',
          text: 'Something else'
        }
      ],
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

function createModelNotEligible () {
  return {
    backLink: '/farming-type',
    sentences: [
      'This is only available to arable and horticultural farming businesses that supply the food industry, nurseries growing flowers or forestry nurseries.'
    ]
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/farming-type',
    handler: (request, h) => h.view('farming-type', createModel(null))
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
        if (
          request.payload.farmingType === 'Crops for the food industry' ||
          request.payload.farmingType === 'Horticulture'
        ) {
          request.yar.set('farmingType', request.payload.farmingType)
          return h.redirect('./project')
        }

        return h.view('./not-eligible', createModelNotEligible())
      }
    }
  }
]
