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

function getContactDetails (request, confirmationId) {
  console.log('New application:')
  console.log(`In England: ${request.yar.get('inEngland')}`)
  console.log(`Business Name: ${request.yar.get('businessName')}`)
  console.log(`Email Address: ${request.yar.get('emailAddress')}`)
  console.log(`Farmer Contact Details: ${request.yar.get('farmerContactDetails')}`)
  console.log(`Farmer Address Details: ${request.yar.get('farmerAddressDetails')}`)
  console.log(`Agent Contact Details: ${request.yar.get('agentContactDetails')}`)
  console.log(`Agent Address Details: ${request.yar.get('agentAddressDetails')}`)
  return {
    confirmationId: confirmationId.toString(),
    inEngland: request.yar.get('inEngland') === 'yes',
    businessName: request.yar.get('businessName'),
    emailAddress: request.yar.get('emailAddress'),
    farmerContactDetails: request.yar.get('farmerContactDetails'),
    farmerAddressDetails: request.yar.get('farmerAddressDetails'),
    agentContactDetails: request.yar.get('agentContactDetails'),
    agentAddressDetails: request.yar.get('agentAddressDetails')
  }
}

module.exports = {
  getDesirabilityAnswers,
  getContactDetails,
  getAllDetails
}
