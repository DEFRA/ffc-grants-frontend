
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
      'town', 'govuk-input--width-10', 'Town (optional)', null, {
        fieldName: detailsData.town,
        fieldError: getFieldError(errorList, '#town'),
        inputType: 'text',
        autocomplete: 'address-level2'
      }
    ),

    inputAddress2: formInputObject(
      'address2', 'govuk-input--width-20', '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>', null, {
        fieldName: detailsData.address2,
        fieldError: getFieldError(errorList, '#address2'),
        inputType: 'text',
        autocomplete: 'address-line2'
      }
    ),

    inputAddress1: formInputObject(
      'address1', 'govuk-input--width-20', 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>', null, {
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
      'email', 'govuk-input--width-20', 'Email address', 'We will use this to send you a confirmation', {
        fieldName: detailsData.email,
        fieldError: getFieldError(errorList, '#email'),
        inputType: 'email',
        autocomplete: 'email'
      }
    ),
    inputPostcode: formInputObject(
      'postcode', 'govuk-input--width-5', 'Postcode', null, {
        fieldName: detailsData.postcode,
        fieldError: getFieldError(errorList, '#postcode'),
        inputType: 'text',
        autocomplete: 'postal-code'
      }
    ),
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
