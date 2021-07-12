const { setLabelData } = require('../helpers/helper-functions')

const createModelTwoRadios = (
  previousPath, currentPath, valueOne, valueTwo, idPrefix, name, text, errorMessage, data
) => ({
  backLink: previousPath,
  formActionPage: currentPath,
  radios: {
    classes: 'govuk-radios--inline',
    idPrefix,
    name,
    fieldset: {
      legend: {
        text,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(data, [valueOne, valueTwo]),
    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
  }
})

module.exports = { createModelTwoRadios }
