describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      project: ['prj'],
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'clb'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      project: ['prj'],
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'clb'
    })

    dict = {
      ...dict,
      collaboration: 'collabration'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      project: ['prj'],
      irrigatedCrops: 'irrigated-crp',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'collabration'
    })

    dict = {
      ...dict,
      irrigationPlanned: ['irg-plan']
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
