const errors = {
  'error.inEngland.any.required': 'Select yes if the project is in England',
  'error.projectPostcode.string.pattern.base': 'Enter a postcode, like AA1 1AA',
  'error.projectPostcode.string.empty': 'Enter a postcode, like AA1 1AA',
  'error.irrigatedCrops.any.required': 'Select the main crop you will be irrigating',
  'error.farmingType.any.required': 'Select the crops you are growing',
  'error.waterSourceCurrent.any.required': 'Select one or two options for each question',
  'error.waterSourcePlanned.any.required': 'Select one or two options for each question',
  'error.projectStarted.any.required': 'Select yes if you have already started work on the project',
  'error.landOwnership.any.required': 'Select yes if the planned project is on land the farm business owns',
  'error.irrigationPlanned.any.required': 'Select one or two options for each question',
  'error.irrigationCurrent.any.required': 'Select one or two options for each question',
  'error.tenancyLength.any.required': 'Select yes if the land has a tenancy agreement in place until 2026 or after',
  'error.planningPermission.any.required': 'Select when the project will have planning permission',
  'error.payRemainingCosts.any.required': 'Select yes if you can pay the remaining costs without using any other grant money',
  'error.projectCost.number.base': 'Enter the estimated cost for the items as a whole number with a maximum of 7 digits',
  'error.projectCost.number.max': 'Enter the estimated cost for the items as a whole number with a maximum of 7 digits',
  'error.projectCost.number.integer': 'Enter the estimated cost for the items as a whole number with a maximum of 7 digits',
  'error.project.any.required': 'Select one or two options',
  'error.legalStatus.any.required': 'Select the legal status of the farm business'
}
const lookupErrorText = (key) => {
  return errors[key] || key
}

module.exports = lookupErrorText
