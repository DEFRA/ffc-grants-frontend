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
    inputBusinessName: formInputObject(
      'businessName', 'govuk-input--width-20', 'Business name', null, { fieldName: businessName, fieldError: businessNameError, inputType: 'text', autocomplete: 'organization' }
    ),
    inputLastName: formInputObject(
      'lastName', 'govuk-input--width-20', 'Last name', null, { fieldName: lastName, fieldError: lastNameError, inputType: 'text', autocomplete: 'family-name' }
    ),
    inputFirstName: formInputObject(
      'firstName', 'govuk-input--width-20', 'First name', null, { fieldName: firstName, fieldError: firstNameError, inputType: 'text', autocomplete: 'given-name' }
    ),
    inputTown: formInputObject(
      'town', 'govuk-input--width-10', 'Town', null, { fieldName: town, fieldError: townError, inputType: 'text', autocomplete: 'address-level2' }
    ),
    inputAddress2: formInputObject(
      'address-line2', 'govuk-input--width-20', null, null, { fieldName: address2, fieldError: null, inputType: 'text', autocomplete: 'address-line2' }
    ),
    inputAddress1: formInputObject(
      'address-line1', 'govuk-input--width-20', 'Building and street', null, { fieldName: address1, fieldError: address1Error, inputType: 'text', autocomplete: 'address-line1' }
    ),
    inputLandline: formInputObject(
      'landline', 'govuk-input--width-20', 'Landline number', null, { fieldName: landline, fieldError: landlineError, inputType: 'tel', autocomplete: 'home tel' }
    ),
    inputMobile: formInputObject(
      'mobile', 'govuk-input--width-20', 'Mobile number', null, { fieldName: mobile, fieldError: mobileError, inputType: 'tel', autocomplete: 'mobile tel' }
    ),
    inputEmail: formInputObject(
      'email', 'govuk-input--width-20', 'Email address', 'We will use this to send you a confirmation', { fieldName: email, fieldError: emailError, inputType: 'email', autocomplete: 'email' }
    ),
    inputPostcode: formInputObject(
      'postcode', 'govuk-input--width-5', 'Postcode', null, { fieldName: postcode, fieldError: postcodeError, inputType: 'text', autocomplete: 'postal-code' }
    ),
    selectCounty: {
      items: setLabelData(county, [
        { text: 'Select an option', value: null },
        ...LIST_COUNTIES
      ]),
      autocomplete: 'address-level1',
      label: { text: 'County' },
      classes: 'govuk-input--width-10',
      name: 'county',
      id: 'county',
      ...(countyError ? { errorMessage: { text: countyError } } : {})
    }
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
          lastName: Joi.string().regex(NAME_REGEX).required(),
          businessName: Joi.string().regex(BUSINESSNAME_REGEX).max(100).required(),
          firstName: Joi.string().regex(NAME_REGEX).required(),
          results: Joi.any(),
          postcode: Joi.string().replace(DELETE_POSTCODE_CHARS_REGEX, '').regex(POSTCODE_REGEX).trim().required(),
          county: Joi.string().required(),
          town: Joi.string().required(),
          address2: Joi.string().allow(''),
          address1: Joi.string().required(),
          landline: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          mobile: Joi.string().regex(PHONE_REGEX).min(10).allow(''),
          email: Joi.string().email().required()
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
