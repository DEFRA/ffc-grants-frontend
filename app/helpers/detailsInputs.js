
const { setLabelData, formInputObject } = require('./helper-functions')
const { getFieldError } = require('./getFieldError')
const { LIST_COUNTIES } = require('./all-counties')

const getDetailsInput = (detailsData, errorList) => {
  return {
    inputFirstName: formInputObject(
      'firstName', 'govuk-input--width-20', 'First name', null, {
      fieldName: detailsData.firstName,
      fieldError: getFieldError(errorList, '#firstName'),
      inputType: 'text',
      autocomplete: 'given-name'
    }
    ),

    inputLastName: formInputObject(
      'lastName', 'govuk-input--width-20', 'Last name', null, {
      fieldName: detailsData.lastName,
      fieldError: getFieldError(errorList, '#lastName'),
      inputType: 'text',
      autocomplete: 'family-name'
    }
    ),

    ...(Object.prototype.hasOwnProperty.call(detailsData, 'businessName') ? { inputBusinessName: formInputObject('businessName', 'govuk-input--width-20', 'Business name', null, { fieldName: detailsData.businessName, fieldError: getFieldError(errorList, '#businessName'), inputType: 'text', autocomplete: 'organization' }) } : null),

    inputTown: formInputObject(
      'town', 'govuk-input--width-10', 'Town', null, {
      fieldName: detailsData.town,
      fieldError: getFieldError(errorList, '#town'),
      inputType: 'text',
      autocomplete: 'address-level2'
    }
    ),

    inputAddress2: formInputObject(
      'address2', 'govuk-input--width-20', 'Address line 2 (optional)', null, {
      fieldName: detailsData.address2,
      fieldError: getFieldError(errorList, '#address2'),
      inputType: 'text',
      autocomplete: 'address-line2'
    }
    ),

    inputAddress1: formInputObject(
      'address1', 'govuk-input--width-20', 'Address line 1', null, {
      fieldName: detailsData.address1,
      fieldError: getFieldError(errorList, '#address1'),
      inputType: 'text',
      autocomplete: 'address-line1'
    }
    ),
    inputLandline: formInputObject(
      'landline', 'govuk-input--width-10', 'Landline number', 'We will only use this to contact you about your application', {
      fieldName: detailsData.landline,
      fieldError: getFieldError(errorList, '#landline'),
      inputType: 'tel',
      autocomplete: 'home tel'
    }
    ),
    inputMobile: formInputObject(
      'mobile', 'govuk-input--width-10', 'Mobile number', 'We will only use this to contact you about your application', {
      fieldName: detailsData.mobile,
      fieldError: getFieldError(errorList, '#mobile'),
      inputType: 'tel',
      autocomplete: 'mobile tel'
    }
    ),
    inputEmail: formInputObject(
      'email', 'govuk-input--width-20', 'Email address', 'We will only use this to send you confirmation', {
      fieldName: detailsData.email,
      fieldError: getFieldError(errorList, '#email'),
      inputType: 'email',
      autocomplete: 'email'
    }
    ),

    ...(Object.prototype.hasOwnProperty.call(detailsData, 'emailConfirm') ?
      {
        inputEmailConfirm: formInputObject(
          'emailConfirm', 'govuk-input--width-20', 'Confirm email address', null, {
          fieldName: detailsData.emailConfirm,
          fieldError: getFieldError(errorList, '#emailConfirm'),
          inputType: 'email',
          autocomplete: 'email'
        })
      }
      :
      {}
    ),

    ...(Object.prototype.hasOwnProperty.call(detailsData, 'projectPostcode') ? { inputProjPostcode: formInputObject('projectPostcode', 'govuk-input--width-5', 'Project postcode', 'The site postcode where the work will happen', { fieldName: detailsData.projectPostcode, fieldError: getFieldError(errorList, '#projectPostcode'), inputType: 'text', autocomplete: 'organization' }) } : {}),
    ...(Object.prototype.hasOwnProperty.call(detailsData, 'businessPostcode') ? { inputBusPostcode: formInputObject('businessPostcode', 'govuk-input--width-5', 'Business postcode', '', { fieldName: detailsData.businessPostcode, fieldError: getFieldError(errorList, '#businessPostcode'), inputType: 'text', autocomplete: 'organization' }) } : {}),
    ...(Object.prototype.hasOwnProperty.call(detailsData, 'postcode') ? { inputPostcode: formInputObject('postcode', 'govuk-input--width-5', 'Postcode', '', { fieldName: detailsData.postcode, fieldError: getFieldError(errorList, '#postcode'), inputType: 'text', autocomplete: 'organization' }) } : {}),

    selectCounty: {
      items: setLabelData(detailsData.county, [
        { text: 'Select an option', value: null },
        ...LIST_COUNTIES
      ]),
      autocomplete: 'address-level1',
      label: { text: 'County' },
      classes: 'govuk-input--width-10',
      name: 'county',
      id: 'county',
      ...(errorList && errorList.some(err => err.href === '#county') ? { errorMessage: { text: errorList.find(err => err.href === '#county').text } } : {})
    }
  }
}

module.exports = {
  getDetailsInput
}
