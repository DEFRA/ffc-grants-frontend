const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, fetchListObjectItems, findErrorList, formInputObject } = require('../helpers/helper-functions')
const { NAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { LIST_COUNTIES } = require('../helpers/all-counties')

function createModel (errorMessageList, farmerDetails, backLink) {
  const {
    firstName,
    lastName,
    email,
    mobile,
    landline,
    address1,
    address2,
    town,
    county,
    postcode
  } = farmerDetails

  const [
    firstNameError,
    lastNameError,
    emailError,
    mobileError,
    landlineError,
    address1Error,
    townError,
    countyError,
    postcodeError
  ] = fetchListObjectItems(
    errorMessageList,
    ['firstNameError', 'lastNameError', 'emailError', 'mobileError', 'landlineError', 'address1Error', 'townError', 'countyError', 'postcodeError']
  )

  return {
    backLink,
    pageId: 'Farmer',
    pageHeader: 'Farmer\'s details',
    formActionPage: './farmer-details',
    inputFirstName: formInputObject('firstName', 'govuk-input--width-20', 'First name', null, firstName, firstNameError),

    inputLastName: formInputObject('lastName', 'govuk-input--width-20', 'Last name', null, lastName, lastNameError),

    inputEmail: formInputObject('email', 'govuk-input--width-20', 'Email address', 'We will use this to send you a confirmation', email, emailError),

    inputMobile: formInputObject('mobile', 'govuk-input--width-20', 'Mobile number', null, mobile, mobileError),

    inputLandline: formInputObject('landline', 'govuk-input--width-20', 'Landline number (optional)', null, landline, landlineError),

    inputAddress1: formInputObject('address1', 'govuk-input--width-20', 'Address 1', null, address1, address1Error),

    inputAddress2: formInputObject('address2', 'govuk-input--width-20', 'Address 2', null, address2, null),

    inputTown: formInputObject('town', 'govuk-input--width-10', 'Town', null, town, townError),

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
    inputPostcode: formInputObject('postcode', 'govuk-input--width-5', 'Postcode', null, postcode, postcodeError)

  }
}

module.exports = [
  {
    method: 'GET',
    path: '/farmer-details',
    handler: async (request, h) => {
      let farmerDetails = getYarValue(request, 'farmerDetails') || null
      if (!farmerDetails) {
        farmerDetails = {
          firstName: null,
          lastName: null,
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

      const applying = getYarValue(request, 'applying')
      const backLink = applying === 'Agent' ? './agent-details' : './applying'
      return h.view('model-farmer-agent-details', createModel(null, farmerDetails, backLink))
    }
  },
  {
    method: 'POST',
    path: '/farmer-details',
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required(),
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
            emailError,
            mobileError,
            landlineError,
            address1Error,
            townError,
            countyError,
            postcodeError
          ] = findErrorList(err, ['firstName', 'lastName', 'email', 'mobile', 'landline', 'address1', 'town', 'county', 'postcode'])

          const errorMessageList = {
            firstNameError, lastNameError, emailError, mobileError, landlineError, address1Error, townError, countyError, postcodeError
          }

          const { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const farmerDetails = { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode }

          const applying = getYarValue(request, 'applying')
          const backLink = applying === 'Agent' ? './agent-details' : './applying'

          return h.view('model-farmer-agent-details', createModel(errorMessageList, farmerDetails, backLink)).takeover()
        }
      },
      handler: (request, h) => {
        const {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode
        } = request.payload

        setYarValue(request, 'farmerDetails', {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode: postcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return h.redirect('./confirm')
      }
    }
  }
]
