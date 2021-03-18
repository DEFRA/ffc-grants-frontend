function isChecked(data, option) {
  return !!data && data.includes(option);
}

function setLabelData(data, labelData) {
  return labelData.map((label) => {
    return {
      value: label,
      text: label,
      checked: isChecked(data, label),
    };
  });
}

function getPostCodeHtml(postcodeData, error) {
  const postcode = postcodeData && postcodeData !== null ? postcodeData : " ";
  return !error
    ? `<div><label class="govuk-label" for="projectPostcode">
  Enter Postcode</label><input class="govuk-input govuk-!-width-one-third" id="projectPostcode" name="projectPostcode" value=${postcode}></div>`
    : `<div class="govuk-form-group--error"><label class="govuk-label" for="projectPostcode">
      Enter Postcode</label><span id="post-code-error" class="govuk-error-message">
      <span class="govuk-visually-hidden">Error:</span> ${error} </span>
      <input class="govuk-input govuk-!-width-one-third govuk-input--error" id="projectPostcode" name="projectPostcode" value=${postcode}></div>`;
}

module.exports = { isChecked, setLabelData, getPostCodeHtml };
