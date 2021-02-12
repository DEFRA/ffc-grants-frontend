const Joi = require('joi')

function createModel (businessName, errorMessage) {
  return {
    backLink: '/country',
    heading: 'Business details',
    nameInput: {
      label: {
        text: 'Business name'
      },
      classes: 'govuk-!-width-three-quarters',
      id: 'businessName',
      name: 'businessName',
      ...(businessName ? { value: businessName } : {}),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/business',
    handler: (request, h) => h.view('business', createModel(request.yar.get('businessName'), null))
  },
  {
    method: 'POST',
    path: '/business',
    options: {
      validate: {
        payload: Joi.object({
          businessName: Joi.string().required()
        }),
        failAction: (request, h) => h.view('business', createModel(null, 'Enter the business name')).takeover()
      },
      handler: (request, h) => {
        request.yar.set('businessName', request.payload.businessName)
        return h.redirect('./contact-details')
      }
    }
  }
]
