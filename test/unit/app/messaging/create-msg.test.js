describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 'irrigatedLandCurrent',
      irrigatedLandTarget: 'irrigatedLandTarget',
      waterSourceCurrent: ['waterSourceCurrent'],
      waterSourcePlanned: ['waterSourcePlanned'],
      irrigationCurrent: ['irrigationCurrent'],
      irrigationPlanned: ['irrigationPlanned'],
      productivity: 'productivity',
      collaboration: 'collaboration',
    }
    expect(getDesirabilityAnswers({})).toEqual({
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 'irrigatedLandCurrent',
      irrigatedLandTarget: 'irrigatedLandTarget',
      waterSourceCurrent: ['waterSourceCurrent'],
      waterSourcePlanned: ['waterSourcePlanned'],
      irrigationCurrent: ['irrigationCurrent'],
      irrigationPlanned: ['irrigationPlanned'],
      productivity: 'productivity',
      collaboration: 'collaboration',
    })

    dict = {
      ...dict,
      environmentalImpact: ['env-imp']
    }
    expect(getDesirabilityAnswers({})).toEqual({
      productsProcessed: 'prod-processed',
      howAddingValue: 'how-av',
      projectImpact: ['proj-imp'],
      futureCustomers: ['future-cust'],
      collaboration: 'collaboration',
      environmentalImpact: ['env-imp']
    })

    dict = {
      ...dict,
      howAddingValue: ['how-av']
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
