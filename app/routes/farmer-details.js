const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, fetchListObjectItems, findErrorList, formInputObject } = require('../helpers/helper-functions')
const { NAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { LIST_COUNTIES } = require('../helpers/all-counties')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'model-farmer-agent-details'
const currentPath = `${urlPrefix}/farmer-details`
const nextPath = `${urlPrefix}/check-details`
const agentDetailsPath = `${urlPrefix}/agent-details`
const applyingPath = `${urlPrefix}/applying`

function createModel (errorMessageList, farmerDetails, backLink, hasDetails) {
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
    formActionPage: currentPath,
    pageHeader: 'Farmer\'s details',
    checkDetail: hasDetails,
    inputFirstName: formInputObject('firstName', 'govuk-input--width-20', 'First name', null, firstName, firstNameError),

    inputLastName: formInputObject('lastName', 'govuk-input--width-20', 'Last name', null, lastName, lastNameError),

    inputEmail: formInputObject('email', 'govuk-input--width-20', 'Email address', 'We will use this to send you a confirmation', email, emailError),

    inputMobile: formInputObject('mobile', 'govuk-input--width-20', 'Mobile number', null, mobile, mobileError),

    inputLandline: formInputObject('landline', 'govuk-input--width-20', 'Landline number', null, landline, landlineError),

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
    path: currentPath,
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
      const backLink = applying === 'Agent' ? agentDetailsPath : applyingPath
      return h.view(viewTemplate, createModel(null, farmerDetails, backLink, getYarValue(request, 'checkDetails')))
    }
  },
  {
    method: 'POST',
    path: currentPath,
    options: {
      validate: {
        options: { abortEarly: false },
        payload: Joi.object({
          firstName: Joi.string().regex(NAME_REGEX).required(),
          lastName: Joi.string().regex(NAME_REGEX).required(),
          email: Joi.string().email().required(),
          mobile: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          landline: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          address1: Joi.string().required(),
          address2: Joi.string().allow(''),
          town: Joi.string().required(),
          county: Joi.string().required(),
          postcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          results: Joi.any()
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

          if (request.payload.landline === '' && request.payload.mobile === '') {
            errorMessageList.mobileError = 'Enter your mobile number'
            errorMessageList.landlineError = 'Enter your landline number'
          }

          const { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const farmerDetails = { firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode }

          const applying = getYarValue(request, 'applying')
          const backLink = applying === 'Agent' ? agentDetailsPath : applyingPath

          return h.view(viewTemplate, createModel(errorMessageList, farmerDetails, backLink, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        const {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode
        } = request.payload

        const phoneErrors = {

          mobileError: 'Enter your mobile number',
          landlineError: 'Enter your landline number'

        }

        if (!landline && !mobile) {
          return h.view(viewTemplate, createModel(phoneErrors, {
            firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        setYarValue(request, 'farmerDetails', {
          firstName, lastName, email, mobile, landline, address1, address2, town, county, postcode: postcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return h.redirect(nextPath)
      }
    }
  }
]
