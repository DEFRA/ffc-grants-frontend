const { setLabelData } = require('../helpers/helper-functions')

const createModelTwoRadios = (
  previousPath, currentPath, values, name, text, errorMessage, data
) => ({
  backLink: previousPath,
  formActionPage: currentPath,
  radios: {
    classes: 'govuk-radios--inline',
    idPrefix: name,
    name,
    fieldset: {
      legend: {
        text,
        isPageHeading: true,
        classes: 'govuk-fieldset__legend--l'
      }
    },
    items: setLabelData(data, [values.valueOne, values.valueTwo]),
    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {})
  }
})

module.exports = { createModelTwoRadios }
