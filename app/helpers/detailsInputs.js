
const { setLabelData, formInputObject } = require('./helper-functions')
const { LIST_COUNTIES } = require('./all-counties')

const getDetailsInput = (detailsData, errorList) => {
  return {

    ...(detailsData.hasOwnProperty('businessName') ? { inputBusinessName: formInputObject('businessName', 'govuk-input--width-20', 'Business name', null, { fieldName: detailsData.businessName, fieldError: errorList && errorList.some(err => err.href === '#businessName') ? errorList.find(err => err.href === '#businessName').text : null, inputType: 'text', autocomplete: 'organization' }) } : null),

    inputLastName: formInputObject(
      'lastName', 'govuk-input--width-20', 'Last name', null, {
        fieldName: detailsData.lastName,
        fieldError: errorList && errorList.some(err => err.href === '#lastName') ? errorList.find(err => err.href === '#lastName').text : null,
        inputType: 'text',
        autocomplete: 'family-name'
      }
    ),

    inputFirstName: formInputObject(
      'firstName', 'govuk-input--width-20', 'First name', null, {
        fieldName: detailsData.firstName,
        fieldError: errorList && errorList.some(err => err.href === '#firstName') ? errorList.find(err => err.href === '#firstName').text : null,
        inputType: 'text',
        autocomplete: 'given-name'
      }
    ),

    inputTown: formInputObject(
      'town', 'govuk-input--width-10', 'Town (optional)', null, {
        fieldName: detailsData.town,
        fieldError: errorList && errorList.some(err => err.href === '#town') ? errorList.find(err => err.href === '#town').text : null,
        inputType: 'text',
        autocomplete: 'address-level2'
      }
    ),

    inputAddress2: formInputObject(
      'address2', 'govuk-input--width-20', '<span class="govuk-visually-hidden">Building and street line 2 of 2</span>', null, {
        fieldName: detailsData.address2,
        fieldError: errorList && errorList.some(err => err.href === '#address2') ? errorList.find(err => err.href === '#address2').text : null,
        inputType: 'text',
        autocomplete: 'address-line2'
      }
    ),

    inputAddress1: formInputObject(
      'address1', 'govuk-input--width-20', 'Building and street <span class="govuk-visually-hidden">line 1 of 2</span>', null, {
        fieldName: detailsData.address1,
        fieldError: errorList && errorList.some(err => err.href === '#address1') ? errorList.find(err => err.href === '#address1').text : null,
        inputType: 'text',
        autocomplete: 'address-line1'
      }
    ),
    inputLandline: formInputObject(
      'landline', 'govuk-input--width-20', 'Landline number', null, {
        fieldName: detailsData.landline,
        fieldError: errorList && errorList.some(err => err.href === '#landline') ? errorList.find(err => err.href === '#landline').text : null,
        inputType: 'tel',
        autocomplete: 'home tel'
      }
    ),
    inputMobile: formInputObject(
      'mobile', 'govuk-input--width-20', 'Mobile number', null, {
        fieldName: detailsData.mobile,
        fieldError: errorList && errorList.some(err => err.href === '#mobile') ? errorList.find(err => err.href === '#mobile').text : null,
        inputType: 'tel',
        autocomplete: 'mobile tel'
      }
    ),
    inputEmail: formInputObject(
      'email', 'govuk-input--width-20', 'Email address', 'We will use this to send you a confirmation', {
        fieldName: detailsData.email,
        fieldError: errorList && errorList.some(err => err.href === '#email') ? errorList.find(err => err.href === '#email').text : null,
        inputType: 'email',
        autocomplete: 'email'
      }
    ),
    inputPostcode: formInputObject(
      'postcode', 'govuk-input--width-5', 'Postcode', null, {
        fieldName: detailsData.postcode,
        fieldError: errorList && errorList.some(err => err.href === '#postcode') ? errorList.find(err => err.href === '#postcode').text : null,
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
