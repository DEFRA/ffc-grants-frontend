describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      summerAbstractChange: 'smr-abs-chn',
      mainsChange: 'mns-chn',
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'collaboration'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      summerAbstractChange: 'smr-abs-chn',
      mainsChange: 'mns-chn',
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'collaboration'
    })

    dict = {
      ...dict,
      waterSourcePlanned: 'wtr-src-pln'
    }
    expect(getDesirabilityAnswers({})).toEqual({
      irrigatedCrops: 'irrigatedCrops',
      irrigatedLandCurrent: 22,
      irrigatedLandTarget: 33,
      waterSourceCurrent: ['wtr-src-ct'],
      waterSourcePlanned: ['wtr-src-pln'],
      summerAbstractChange: 'smr-abs-chn',
      mainsChange: 'mns-chn',
      irrigationCurrent: ['irg-cur'],
      irrigationPlanned: ['irg-plan'],
      productivity: ['productivity'],
      collaboration: 'collaboration'
    })

    dict = {
      ...dict,
      collaboration: ['collaboration']
    }
    expect(getDesirabilityAnswers({})).toEqual(null)
  })
})
