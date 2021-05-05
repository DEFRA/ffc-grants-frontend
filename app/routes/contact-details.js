const Joi = require('joi')

function createModel (emailAddress, errorMessage) {
  return {
    backLink: './business',
    heading: 'Your contact details',
    emailInput: {
      label: {
        text: 'Email address'
      },
      hint: {
        text: 'We will only use this to contact you about this expression of interest'
      },
      classes: 'govuk-!-width-three-quarters',
      id: 'emailAddress',
      name: 'emailAddress',
      ...(emailAddress ? { value: emailAddress } : {}),
      ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/contact-details',
    handler: (request, h) => h.view('contact-details', createModel(request.yar.get('emailAddress'), null))
  },
  {
    method: 'POST',
    path: '/contact-details',
    options: {
      validate: {
        payload: Joi.object({
          emailAddress: Joi.string().email().required()
        }),
        failAction: (request, h) => h.view('contact-details', createModel(request.payload.emailAddress, 'Enter your email address')).takeover()
      },
      handler: (request, h) => {
        request.yar.set('emailAddress', request.payload.emailAddress)
        return h.redirect('./confirmation')
      }
    }
  }
]
