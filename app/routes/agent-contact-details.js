const Joi = require('joi')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')

function createModel (errorMessageList, agentContactDetails) {
  const { email, landline, mobile } = agentContactDetails

  const [emailError, landlineError, mobileError] = fetchListObjectItems(
    errorMessageList,
    ['emailError', 'landlineError', 'mobileError']
  )

  return {
    backLink: '/agent-details',
    pageHeader: 'Agent\'s contact details',
    formActionPage: '/agent-contact-details',
    inputEmail: {
      id: 'email',
      name: 'email',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Email address',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      hint: {
        text:
          'We will only use this to send you a confirmation'
      },
      ...(email ? { value: email } : {}),
      ...(emailError ? { errorMessage: { text: emailError } } : {})
    },
    inputLandline: {
      id: 'landline',
      name: 'landline',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Landline number (optional)',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      ...(landline ? { value: landline } : {}),
      ...(landlineError ? { errorMessage: { text: landlineError } } : {})
    },
    inputMobile: {
      id: 'mobile',
      name: 'mobile',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Mobile number',
        classes: 'govuk-label--m',
        isPageHeading: true
      },
      ...(mobile ? { value: mobile } : {}),
      ...(mobileError ? { errorMessage: { text: mobileError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/agent-contact-details',
    handler: (request, h) => {
      let agentContactDetails = request.yar.get('agentContactDetails') || null

      if (!agentContactDetails) {
        agentContactDetails = {
          email: null,
          landline: null,
          mobile: null
        }
      }

      return h.view(
        'model-farmer-agent-contact-details',
        createModel(null, agentContactDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/agent-contact-details',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          email: Joi.string().email().required(),
          landline: Joi.string().regex(/^[0-9\t-+()]+$/).allow(''),
          mobile: Joi.string().regex(/^[0-9\t-+()]+$/).required()
        }),
        failAction: (request, h, err) => {
          const [
            emailError, landlineError, mobileError
          ] = findErrorList(err, ['email', 'landline', 'mobile'])

          const errorMessageList = {
            emailError, landlineError, mobileError
          }

          const { email, landline, mobile } = request.payload
          const agentContactDetails = { email, landline, mobile }

          return h.view('model-farmer-agent-contact-details', createModel(errorMessageList, agentContactDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const { email, landline, mobile } = request.payload

        request.yar.set('agentContactDetails', {
          email, landline, mobile
        })

        return h.redirect('./confirm')
      }
    }
  }
]
