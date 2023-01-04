const getHtml = (label, labelData, fieldValueData, error) => {
  const fieldValue = fieldValueData?.trim() || ''

  if (label === 'roboticEquipment') {
    return !error
      ? `<div class="govuk-character-count" data-module="govuk-character-count" data-maxwords="60">
        <div class="govuk-form-group">
          <label class="govuk-label" for="${label}">
            ${labelData}
          </label>
          <textarea class="govuk-textarea govuk-js-character-count" id="${label}" name="${label}" rows="5" aria-describedby="${label}-info">${fieldValue}</textarea>
        </div>
        <div id="${label}-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
          You can enter up to 60 words
        </div>
      </div>`
      : `<div class="govuk-character-count" data-module="govuk-character-count" data-maxwords="60">
      <div class="govuk-form-group govuk-form-group--error">
        <label class="govuk-label" for="${label}">
          ${labelData}
        </label>
        <span id="${labelData}-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span>
          ${error}
        </span>
        <textarea class="govuk-textarea govuk-textarea--error govuk-js-character-count" id="${label}" name="${label}" rows="5" autocomplete="off" aria-describedby="${label}-info ${label}-error">${fieldValue}</textarea>
      </div>
      <div id="${label}-info" class="govuk-hint govuk-character-count__message" aria-live="polite">
        You can enter up to 60 words
      </div>
    </div>`
  }

  return !error
    ? `<div>
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <input class="govuk-input govuk-!-width-one-third" id="${label}" name="${label}" value="${fieldValue}">
      </div>`
    : `<div class="govuk-form-group--error">
        <label class="govuk-label" for="${label}">
        ${labelData}
        </label>
        <span id="post-code-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">
            Error:
          </span>
          ${error}
        </span>
        <input class="govuk-input govuk-!-width-one-third govuk-input--error" autocomplete="off" id="${label}" name="${label}" value="${fieldValue}">
      </div>`
}

module.exports = {
  getHtml
}
