const Joi = require('joi')
const { fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { PHONE_REGEX } = require('../helpers/regex-validation')

function createModel (errorMessageList, farmerContactDetails) {
  const { email, landline, mobile } = farmerContactDetails

  const [emailError, landlineError, mobileError] = fetchListObjectItems(
    errorMessageList,
    ['emailError', 'landlineError', 'mobileError']
  )

  return {
    backLink: './farmer-details',
    pageHeader: 'Farmer\'s contact details',
    formActionPage: '/farmer-contact-details',
    inputEmail: {
      id: 'email',
      name: 'email',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Email address'
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
    path: '/farmer-contact-details',
    handler: (request, h) => {
      let farmerContactDetails = request.yar.get('farmerContactDetails') || null

      if (!farmerContactDetails) {
        farmerContactDetails = {
          email: null,
          landline: null,
          mobile: null
        }
      }

      return h.view(
        'model-farmer-agent-contact-details',
        createModel(null, farmerContactDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/farmer-contact-details',
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
          const farmerContactDetails = { email, landline, mobile }

          return h.view('model-farmer-agent-contact-details', createModel(errorMessageList, farmerContactDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const { email, landline, mobile } = request.payload

        request.yar.set('farmerContactDetails', {
          email, landline, mobile
        })

        return h.redirect('./farmer-address-details')
      }
    }
  }
]
