const isInteger = (number) => {
  // NOT using Number.isInteger() because
  //  - not working on Internet Explorer
  //  - Number.isInteger(40000.00) === false ( instead of true )

  return (number - Math.floor(number)) === 0
}

const formatUKCurrency = (costPounds) => {
  costPounds = costPounds.toString().replace(/,/g, '')
  return isInteger(costPounds)
    ? Number(costPounds).toLocaleString('en-GB')
    : Number(costPounds).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
module.exports = {
  formatUKCurrency
}
