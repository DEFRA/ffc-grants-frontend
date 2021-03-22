const lookupErrorText = require('./lookupErrorText')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    return {
      value: label,
      text: label,
      checked: isChecked(data, label)
    }
  })
}

function getPostCodeHtml (postcodeData, error) {
  const postcode = postcodeData || ''

  return !error
    ? `<div>
        <label class="govuk-label" for="projectPostcode">
          Enter Postcode
        </label>
        <input class="govuk-input govuk-!-width-one-third" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
    : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="projectPostcode">
          Enter Postcode
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span> 
          ${error} 
        </span>
        <input class="govuk-input govuk-!-width-one-third govuk-input--error" id="projectPostcode" name="projectPostcode" value="${postcode}">
      </div>`
}

function errorExtractor (data) {
  const { details } = data
  const errorObject = {}

  details.forEach((detail) => {
    if (detail.path.length > 0) {
      const errorKey = detail.path.join().replace(/,/gi, '.')
      errorObject[errorKey] = `error.${errorKey}.${detail.type}`
    } else if (detail.context.label) {
      errorObject[detail.context.label] = `error.${detail.context.label}.${detail.type}`
    }
  })

  return errorObject
}

function getErrorMessage (object) {
  return lookupErrorText(object[Object.keys(object)[0]])
}

module.exports = { isChecked, setLabelData, getPostCodeHtml, errorExtractor, getErrorMessage }
