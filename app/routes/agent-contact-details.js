const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { PHONE_REGEX } = require('../helpers/regex-validation')

function createModel(errorMessageList, agentContactDetails) {
  const { email, landline, mobile } = agentContactDetails

  const [emailError, landlineError, mobileError] = fetchListObjectItems(
    errorMessageList,
    ['emailError', 'landlineError', 'mobileError']
  )

  return {
    backLink: './agent-details',
    pageHeader: 'Agent\'s contact details',
    formActionPage: './agent-contact-details',
    inputEmail: {
      id: 'email',
      name: 'email',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Email address'
      },
      hint: {
        text:
          'We will use this to send you a confirmation'
      },
      ...(email ? { value: email } : {}),
      ...(emailError ? { errorMessage: { text: emailError } } : {})
    },
    inputLandline: {
      id: 'landline',
      name: 'landline',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Landline number (optional)'
      },
      ...(landline ? { value: landline } : {}),
      ...(landlineError ? { errorMessage: { text: landlineError } } : {})
    },
    inputMobile: {
      id: 'mobile',
      name: 'mobile',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Mobile number'
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
      let agentContactDetails = getYarValue(request, 'agentContactDetails') || null

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
          landline: Joi.string().regex(PHONE_REGEX).allow(''),
          mobile: Joi.string().regex(PHONE_REGEX).required()
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

        setYarValue(request, 'agentContactDetails', {
          email, landline, mobile
        })

        return h.redirect('./agent-address-details')
      }
    }
  }
]
