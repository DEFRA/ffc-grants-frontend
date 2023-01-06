const lookupErrorText = require('./lookupErrorText')
const { GRANT_PERCENTAGE } = require('../helpers/grant-details')

function isChecked (data, option) {
  return !!data && data.includes(option)
}

function setLabelData (data, labelData) {
  return labelData.map((label) => {
    if (typeof (label) === 'string' && label !== 'divider') {
      return {
        value: label,
        text: label,
        checked: isChecked(data, label),
        selected: data === label
      }
    }
    if (label === 'divider') {
      return { divider: 'or' }
    }

    const { text, value, hint } = label
    return {
      value,
      text,
      checked: isChecked(data, value),
      selected: data === value,
      hint
    }
  })
}

function getGrantValues (projectCost) {
  const calculatedGrant = Number(GRANT_PERCENTAGE * projectCost / 100).toFixed(2)
  const remainingCost = Number(projectCost - calculatedGrant).toFixed(2)

  return { calculatedGrant, remainingCost }
}

function isInteger (number) {
  // NOT using Number.isInteger() because
  //  - not working on Internet Explorer
  //  - Number.isInteger(40000.00) === false ( instead of true )
  return (number - Math.floor(number)) === 0
}

function formatUKCurrency (costPounds) {
  return (isInteger(costPounds))
    ? Number(costPounds).toLocaleString('en-GB')
    : Number(costPounds).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function findErrorList ({ details }, inputFields) {
  const errorCodes = inputFields.map(input => {
    const foundErrorList = details.filter(({ context: { label: valLabel } }) => (valLabel === input))

    if (foundErrorList.length === 0) { return null }

    const { type, context: { label } } = foundErrorList[0]
    return (`error.${label}.${type}`)
  })

  return errorCodes.map(err => (
    err === null
      ? null
      : lookupErrorText(err)
  ))
}


module.exports = {
  isChecked,
  setLabelData,
  getGrantValues,
  formatUKCurrency,
  isInteger,
  findErrorList
}
