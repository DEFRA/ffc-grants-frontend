const Joi = require('joi')

function createModel (emailAddress, errorMessage) {
  return {
    hideReturn: true,
    backLink: './save-progress',
    heading: 'Your email address',
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
    path: '/email',
    handler: (request, h) => h.view('email', createModel(request.yar.get('emailAddress'), null))
  },
  {
    method: 'POST',
    path: '/email',
    options: {
      validate: {
        payload: Joi.object({
          emailAddress: Joi.string().email().required()
        }),
        failAction: (request, h) => h.view('email', createModel(request.payload.emailAddress, 'Enter your email address')).takeover()
      },
      handler: (request, h) => {
        return h.redirect(`./progress-reference?email=${request.payload.emailAddress}`)
      }
    }
  }
]
