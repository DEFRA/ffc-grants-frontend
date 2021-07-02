const Joi = require('joi')
const { setYarValue, getYarValue } = require('../helpers/session')
const { setLabelData, fetchListObjectItems, findErrorList, formInputObject } = require('../helpers/helper-functions')
const { NAME_REGEX, BUSINESSNAME_REGEX, PHONE_REGEX, POSTCODE_REGEX, DELETE_POSTCODE_CHARS_REGEX } = require('../helpers/regex-validation')
const { LIST_COUNTIES } = require('../helpers/all-counties')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'model-farmer-agent-details'
const currentPath = `${urlPrefix}/agent-details`
const previousPath = `${urlPrefix}/applying`
const nextPath = `${urlPrefix}/farmer-details`
const detailsPath = `${urlPrefix}/check-details`

function createModel (errorMessageList, agentDetails, hasDetails) {
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
    backLink: previousPath,
    formActionPage: currentPath,
    pageId: 'Agent',
    pageHeader: 'Agent\'s details',
    checkDetail: hasDetails,
    inputFirstName: formInputObject('firstName', 'govuk-input--width-20', 'First name', null, firstName, firstNameError),

    inputLastName: formInputObject('lastName', 'govuk-input--width-20', 'Last name', null, lastName, lastNameError),

    inputBusinessName: formInputObject('businessName', 'govuk-input--width-20', 'Business name', null, businessName, businessNameError),

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
      return h.view(viewTemplate, createModel(null, agentDetails, getYarValue(request, 'checkDetails')))
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
          businessName: Joi.string().regex(BUSINESSNAME_REGEX).max(100).required(),
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

          if (request.payload.landline === '' && request.payload.mobile === '') {
            errorMessageList.mobileError = 'Enter a contact number'
            errorMessageList.landlineError = 'Enter a contact number'
          }

          const { firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode } = request.payload
          const agentDetails = { firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode }
          return h.view(viewTemplate, createModel(errorMessageList, agentDetails, getYarValue(request, 'checkDetails'))).takeover()
        }
      },
      handler: (request, h) => {
        const {
          firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode, results
        } = request.payload

        const phoneErrors = {
          mobileError: 'Enter a contact number',
          landlineError: 'Enter a contact number'
        }

        if (!landline && !mobile) {
          return h.view(viewTemplate, createModel(phoneErrors, {
            firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode
          }, getYarValue(request, 'checkDetails'))).takeover()
        }

        setYarValue(request, 'agentDetails', {
          firstName, lastName, businessName, email, mobile, landline, address1, address2, town, county, postcode: postcode.split(/(?=.{3}$)/).join(' ').toUpperCase()
        })

        return results ? h.redirect(detailsPath) : h.redirect(nextPath)
      }
    }
  }
]
