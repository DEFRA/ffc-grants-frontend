const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, fetchListObjectItems, findErrorList } = require('../helpers/helper-functions')
const { NAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { LIST_COUNTIES } = require('../helpers/all-counties')

function createModel (errorMessageList, agentDetails) {
  const {
    firstName,
    lastName,
    businessName,
    email,
    mobile,
    landline,
    address1,
    address2,
    town,
    county,
    postcode
  } = agentDetails

  const [
    firstNameError,
    lastNameError,
    businessNameError,
    emailError,
    mobileError,
    landlineError,
    address1Error,
    townError,
    countyError,
    postcodeError
  ] = fetchListObjectItems(
    errorMessageList,
    ['firstNameError', 'lastNameError', 'businessNameError', 'emailError', 'mobileError', 'landlineError', 'address1Error', 'townError', 'countyError', 'postcodeError']
  )

  return {
    backLink: './applying',
    pageId: 'Agent',
    pageHeader: 'Agent\'s details',
    formActionPage: './agent-details',
    inputFirstName: {
      id: 'firstName',
      name: 'firstName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'First name'
      },
      ...(firstName ? { value: firstName } : {}),
      ...(firstNameError ? { errorMessage: { text: firstNameError } } : {})
    },
    inputLastName: {
      id: 'lastName',
      name: 'lastName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Last name'
      },
      ...(lastName ? { value: lastName } : {}),
      ...(lastNameError ? { errorMessage: { text: lastNameError } } : {})
    },
    inputBusinessName: {
      id: 'businessName',
      name: 'businessName',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Business name'
      },
      ...(businessName ? { value: businessName } : {}),
      ...(businessNameError ? { errorMessage: { text: businessNameError } } : {})
    },
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
    inputMobile: {
      id: 'mobile',
      name: 'mobile',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Mobile number'
      },
      ...(mobile ? { value: mobile } : {}),
      ...(mobileError ? { errorMessage: { text: mobileError } } : {})
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
    inputAddress1: {
      id: 'address1',
      name: 'address1',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Address 1'
      },
      ...(address1 ? { value: address1 } : {}),
      ...(address1Error ? { errorMessage: { text: address1Error } } : {})
    },
    inputAddress2: {
      id: 'address2',
      name: 'address2',
      classes: 'govuk-input--width-20',
      label: {
        text: 'Address 2 (optional)'
      },
      ...(address2 ? { value: address2 } : {})
    },
    inputTown: {
      id: 'town',
      name: 'town',
      classes: 'govuk-input--width-10',
      label: {
        text: 'Town'
      },
      ...(town ? { value: town } : {}),
      ...(townError ? { errorMessage: { text: townError } } : {})
    },
    selectCounty: {
      id: 'county',
      name: 'county',
      classes: 'govuk-input--width-10',
      label: {
        text: 'County'
      },
      items: setLabelData(county, [
        { text: 'Select an option', value: null },
        ...LIST_COUNTIES
      ]),
      ...(countyError ? { errorMessage: { text: countyError } } : {})
    },
    inputPostcode: {
      id: 'postcode',
      name: 'postcode',
      classes: 'govuk-input--width-5',
      label: {
        text: 'Postcode'
      },
      ...(postcode ? { value: postcode } : {}),
      ...(postcodeError ? { errorMessage: { text: postcodeError } } : {})
    }
  }
}

module.exports = [
  {
    method: 'GET',
    path: '/agent-details',
    handler: async (request, h) => {
      let agentDetails = getYarValue(request, 'agentDetails') || null
      if (!agentDetails) {
        agentDetails = {
          firstName: null,
          lastName: null,
          businessName: null,
          email: null,
          mobile: null,
          landline: null,
          address1: null,
          address2: null,
          town: null,
          county: null,
          postcode: null
        }
      }
      return h.view(
        'model-farmer-agent-details',
        createModel(null, agentDetails)
      )
    }
  },
  {
    method: 'POST',
    path: '/agent-details',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required(),
          businessName: Joi.string().max(100).required(),
          email: Joi.string().email().required(),
          mobile: Joi.string().regex(PHONE_REGEX).required(),
          landline: Joi.string().regex(PHONE_REGEX).allow(''),
          address1: Joi.string().required(),
          address2: Joi.string().allow(''),
          town: Joi.string().required(),
          county: Joi.string().required(),
          postcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required()
        }),
        failAction: (request, h, err) => {
          const [
            firstNameError,
            lastNameError,
            businessNameError,
            emailError,
            mobileError,
            landlineError,
            address1Error,
            townError,
            countyError,
            postcodeError
          ] = findErrorList(err, ['firstName', 'lastName', 'businessName', 'email', 'mobile', 'landline', 'address1', 'town', 'county', 'postcode'])

          const errorMessageList = {
            firstNameError, lastNameError, businessNameError, emailError, mobileError, landlineError, address1Error, townError, countyError, postcodeError
          }

          const { firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const agentDetails = { firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode }

          return h.view('model-farmer-agent-details', createModel(errorMessageList, agentDetails)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode
        } = request.payload

        setYarValue(request, 'agentDetails', {
          firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode
        })

        return h.redirect('./farmer-details')
      }
    }
  }
]
