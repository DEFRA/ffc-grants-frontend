describe('Grants Info', () => {
  const { getGrantValues } = require('../../../../app/helpers/grants-info')

  test('is eligible if calculated grant = min grant - whether grant is capped or not', () => {
    const projectCostValue = '50'
    const grantsInfo = {
      minGrant: 10,
      maxGrant: 1000,
      grantPercentage: 20,
      cappedGrant: false
    }

    expect(Number(projectCostValue)).toBe(50)

    const notCappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(notCappedGrantResult.isEligible).toBe(true)

    grantsInfo.cappedGrant = true
    const cappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(cappedGrantResult.isEligible).toBe(true)
  })

  test('is not eligible if calculated grant < min grant - whether grant is capped or not', () => {
    const projectCostValue = '49'
    const grantsInfo = {
      minGrant: 10,
      maxGrant: 1000,
      grantPercentage: 20,
      cappedGrant: false
    }

    expect(Number(projectCostValue)).toBe(49)

    const notCappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(notCappedGrantResult.isEligible).toBe(false)

    grantsInfo.cappedGrant = true
    const cappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(cappedGrantResult.isEligible).toBe(false)
  })

  test('if (calculatedGrant < maxGrant ) => [calculatedGrant + remainingCost = projectCostValue] - whether grant is capped or not', () => {
    const projectCostValue = '50'
    const grantsInfo = {
      minGrant: 10,
      maxGrant: 1000,
      grantPercentage: 20,
      cappedGrant: false
    }

    expect(Number(projectCostValue)).toBe(50)

    const notCappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(notCappedGrantResult.calculatedGrant < grantsInfo.maxGrant)
    expect(Number(notCappedGrantResult.calculatedGrant) + Number(notCappedGrantResult.remainingCost)).toEqual(Number(projectCostValue))

    grantsInfo.cappedGrant = true
    const cappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(cappedGrantResult.calculatedGrant < grantsInfo.maxGrant)
    expect(Number(cappedGrantResult.calculatedGrant) + Number(cappedGrantResult.remainingCost)).toEqual(Number(projectCostValue))
  })

  test('if (calculatedGrant > maxGrant ) => [calculatedGrant + remainingCost = projectCostValue] - whether grant is capped or not', () => {
    const projectCostValue = '50000'
    const grantsInfo = {
      minGrant: 10,
      maxGrant: 1000,
      grantPercentage: 20,
      cappedGrant: false
    }

    expect(Number(projectCostValue)).toBe(50000)

    const notCappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(notCappedGrantResult.calculatedGrant > grantsInfo.maxGrant)
    expect(Number(notCappedGrantResult.calculatedGrant) + Number(notCappedGrantResult.remainingCost)).toEqual(Number(projectCostValue))

    grantsInfo.cappedGrant = true
    const cappedGrantResult = getGrantValues(projectCostValue, grantsInfo)
    expect(cappedGrantResult.calculatedGrant > grantsInfo.maxGrant)
    expect(Number(cappedGrantResult.calculatedGrant) + Number(cappedGrantResult.remainingCost)).toEqual(Number(projectCostValue))
  })
})
