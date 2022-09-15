const { setLabelData } = require('../helpers/helper-functions')

const createModelTwoRadios = (
  previousPath, currentPath, values, name, text, errorList, data, hint
) => ({
  backLink: previousPath,
  formActionPage: currentPath,
  ...errorList ? { errorList } : {},
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
    ...hint ? {hint} : {},
    items: setLabelData(data, [values.valueOne, values.valueTwo]),
    ...(errorList ? { errorMessage: { text: errorList[0].text } } : {})
  }
})

module.exports = { createModelTwoRadios }
