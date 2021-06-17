const errors = {
  'error.inEngland.any.required': 'Select yes if the project is in England',
  'error.projectPostcode.string.pattern.base': 'Enter a postcode, like AA1 1AA',
  'error.projectPostcode.string.empty': 'Enter a postcode, like AA1 1AA',
  'error.irrigatedCrops.any.required': 'Select the main crop you will be irrigating',
  'error.farmingType.any.required': 'Select the crops you are growing',
  'error.waterSourceCurrent.any.required': 'Select one or two options for each question',
  'error.waterSourcePlanned.any.required': 'Select one or two options for each question',
  'error.projectStarted.any.required': 'Select the option that applies to your project',
  'error.landOwnership.any.required': 'Select yes if the planned project is on land the farm business owns',
  'error.irrigationPlanned.any.required': 'Select one or two options for each question',
  'error.irrigationCurrent.any.required': 'Select one or two options for each question',
  'error.tenancyLength.any.required': 'Select yes if the land has a tenancy agreement in place until 2026 or after',
  'error.planningPermission.any.required': 'Select when the project will have planning permission',
  'error.payRemainingCosts.any.required': 'Select yes if you can pay the remaining costs without using any other grant money',
  'error.projectCost.any.required': 'Enter the estimated cost for the items',
  'error.projectCost.string.empty': 'Enter the estimated cost for the items',
  'error.projectCost.string.pattern.base': 'Enter a whole number with a maximum of 7 digits',
  'error.projectCost.string.max': 'Enter a whole number with a maximum of 7 digits',
  'error.project.any.required': 'Select one or two options',
  'error.legalStatus.any.required': 'Select the legal status of the farm business',
  'error.legalStatus.string.base': 'Select the legal status of the farm business',
  'error.projectName.any.required': 'Enter a project name',
  'error.projectName.string.empty': 'Enter a project name',
  'error.businessName.any.required': 'Enter a business name',
  'error.businessName.string.empty': 'Enter a business name',
  'error.businessName.string.max': 'Name must be 100 characters or fewer',
  'error.numberEmployees.any.required': 'Enter the number of employees',
  'error.numberEmployees.string.empty': 'Enter the number of employees',
  'error.numberEmployees.string.pattern.base': 'Number of employees must be a whole number, like 305',
  'error.numberEmployees.string.max': 'Number of employees must be a whole number, like 305',
  'error.businessTurnover.any.required': 'Enter the business turnover',
  'error.businessTurnover.string.empty': 'Enter the business turnover',
  'error.businessTurnover.string.pattern.base': 'Business turnover must be a whole number, like 100000',
  'error.businessTurnover.string.max': 'Business turnover must be a whole number, like 100000',
  'error.sbi.string.pattern.base': 'SBI number must have 9 characters, like 011115678',
  'error.sbi.string.min': 'SBI number must have 9 characters, like 011115678',
  'error.sbi.string.max': 'SBI number must have 9 characters, like 011115678',
  'error.firstName.string.empty': 'Enter your first name',
  'error.firstName.any.required': 'Enter your first name',
  'error.firstName.string.pattern.base': 'Name must only include letters, hyphens and apostrophes',
  'error.lastName.string.empty': 'Enter your last name',
  'error.lastName.any.required': 'Enter your last name',
  'error.lastName.string.pattern.base': 'Name must only include letters, hyphens and apostrophes',
  'error.gender.any.required': 'Select an option',
  'error.email.string.empty': 'Enter your email address',
  'error.email.any.required': 'Enter your email address',
  'error.email.string.email': 'Enter an email address in the correct format, like name@example.com',
  'error.mobile.string.empty': 'Enter your mobile number',
  'error.mobile.any.required': 'Enter your mobile number',
  'error.mobile.string.pattern.base': 'Enter a telephone number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192',
  'error.mobile.string.min': 'Your mobile number must have at least 10 characters',
  'error.landline.string.empty': 'Enter your landline number',
  'error.landline.string.min': 'Your landline number must have at least 10 characters',
  'error.landline.any.required': 'Enter your landline number',
  'error.landline.string.pattern.base': 'Enter a landline number, like 01632 960 001, 07700 900 982 or +44 0808 157 0192',
  'error.address1.string.empty': 'Enter line 1 of your address',
  'error.address1.any.required': 'Enter line 1 of your address',
  'error.address2.string.empty': 'Enter line 2 of your address',
  'error.address2.any.required': 'Enter line 2 of your address',
  'error.town.string.empty': 'Enter your town',
  'error.town.any.required': 'Enter your town',
  'error.county.string.empty': 'Select your county',
  'error.county.any.required': 'Select your county',
  'error.postcode.string.empty': 'Enter your postcode, like AA1 1AA',
  'error.postcode.any.required': 'Enter your postcode, like AA1 1AA',
  'error.postcode.string.pattern.base': 'Enter a postcode, like AA1 1AA',
  'error.abstractionLicence.any.required': 'Select when the project will have an abstraction licence or variation',
  'error.productivity.any.required': 'Select one or two options',
  'error.collaboration.any.required': 'Select yes if water will be supplied to other farms',
  'error.collaboration.string.base': 'Select yes if water will be supplied to other farms',
  'error.irrigatedLandCurrent.string.empty': 'Enter how many hectares are irrigated currently',
  'error.irrigatedLandCurrent.any.required': 'Enter how many hectares are irrigated currently',
  'error.irrigatedLandCurrent.string.pattern.base': 'Hectare value must be a number, with only one decimal place',
  'error.irrigatedLandTarget.string.empty': 'Enter how many hectares will be irrigated after the project',
  'error.irrigatedLandTarget.any.required': 'Enter how many hectares will be irrigated after the project',
  'error.irrigatedLandTarget.string.pattern.base': 'Hectare value must be a number, with only one decimal place',
  'error.sSSI.any.required': 'Select yes if the project directly impacts a Site of Special Scientific Interest',
  'error.consentMain.string.empty': 'Please confirm you are happy to be contacted about your application.',
  'error.consentMain.any.required': 'Please confirm you are happy to be contacted about your application.'
}
const lookupErrorText = (key) => {
  return errors[key] || key
}

module.exports = lookupErrorText
