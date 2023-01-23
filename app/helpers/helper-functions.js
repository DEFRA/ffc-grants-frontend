const lookupErrorText = require('./lookupErrorText')
const { GRANT_PERCENTAGE } = require('../helpers/grant-details')
const {
  DONT_USE,
  DECREASE,
  STOP_MAINTAIN_INTRODUCE_CURRENT,
  STOP_MAINTAIN_INTRODUCE_PLANNED,
  MAINTAIN
} = require('../helpers/water-source-data')

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

function formatUKCurrency (costPounds) {
  return Number(costPounds).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
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
const getCurrentWaterSourceOptions = (mains) => {
  switch (mains) {
    case 'Don\'t use currently':
      return DONT_USE
    case 'Decrease':
      return DECREASE
    case 'Maintain without introducing or increasing a sustainable water source':
      return MAINTAIN
    default:
      return STOP_MAINTAIN_INTRODUCE_CURRENT
  }
}

const getPlannedWaterSourceOptions = (mains) => {
  console.log('I got planned mains')
  switch (mains) {
    case 'Don\'t use currently':
      return DONT_USE
    case 'Decrease':
      return DECREASE
    case 'Maintain without introducing or increasing a sustainable water source':
      return MAINTAIN
    default:
      return STOP_MAINTAIN_INTRODUCE_PLANNED
  }
}

module.exports = {
  isChecked,
  setLabelData,
  getGrantValues,
  formatUKCurrency,
  findErrorList,
  getCurrentWaterSourceOptions,
  getPlannedWaterSourceOptions
}
