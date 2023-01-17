const getGrantValues = (projectCostValue, grantsInfo) => {
  const { minGrant, maxGrant, grantPercentage, cappedGrant } = grantsInfo

  let calculatedGrant = grantPercentage ? Number(grantPercentage * projectCostValue / 100).toFixed(2) : projectCostValue

  if (cappedGrant) {
    calculatedGrant = Math.min(calculatedGrant, maxGrant)
  }
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  const projectCost = Number(projectCostValue)
  const isEligible = (
    (minGrant <= calculatedGrant) && (calculatedGrant <= maxGrant)
  )
  return { calculatedGrant, remainingCost, isEligible, projectCost }
}

module.exports = {
  getGrantValues
}
