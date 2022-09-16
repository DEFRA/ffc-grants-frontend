const { setLabelData } = require('../helpers/helper-functions')

const createModelTwoRadios = (
  previousPath, currentPath, values, name, text, extraDetails
) => ({
  backLink: previousPath,
  formActionPage: currentPath,
  ...extraDetails.errorList ? { errorList: extraDetails.errorList } : {},
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
    ...extraDetails.hint ? { hint: extraDetails.hint } : {},
    items: setLabelData(extraDetails.data, [values.valueOne, values.valueTwo]),
    ...(extraDetails.errorList ? { errorMessage: { text: extraDetails.errorList[0].text } } : {})
  }
})

module.exports = { createModelTwoRadios }
