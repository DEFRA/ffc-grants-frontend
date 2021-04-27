const allYarKeys = require('../helpers/yar-keys')

function getAllDetails (request, confirmationId) {
  return allYarKeys.reduce(
    (allDetails, key) => {
      allDetails[key] = request.yar.get(key)
      return allDetails
    },
    { confirmationId }
  )
}

function getDesirabilityAnswers (request) {
  return {
    project: request.yar.get('project'),
    irrigatedCrops: request.yar.get('irrigatedCrops'),
    irrigatedLandCurrent: Number(request.yar.get('irrigatedLandCurrent')),
    irrigatedLandTarget: Number(request.yar.get('irrigatedLandTarget')),
    waterSourceCurrent: request.yar.get('waterSourceCurrent'),
    waterSourcePlanned: request.yar.get('waterSourcePlanned'),
    irrigationCurrent: request.yar.get('irrigationCurrent'),
    irrigationPlanned: request.yar.get('irrigationPlanned'),
    productivity: request.yar.get('productivity'),
    collaboration: request.yar.get('collaboration')
  }
}

module.exports = {
  getDesirabilityAnswers,
  getAllDetails
}
