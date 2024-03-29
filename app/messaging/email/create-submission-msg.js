const emailConfig = require('./config/email')
const spreadsheetConfig = require('./config/spreadsheet')

function getQuestionScoreBand (questions, questionKey) {
  return questions.find(question => question.key === questionKey).rating.band
}

function generateRow (rowNumber, name, value, bold = false) {
  return {
    row: rowNumber,
    values: ['', name, value],
    bold
  }
}

function farmingTypeMapping (farmingType) {
  switch (farmingType) {
    case 'Crops for the food industry':
      return 'Arable farmer'
    case 'Horticulture (including ornamentals)':
      return 'Horticultural business'
    default:
      return 'Error: failed to map farming type'
  }
}

const getMappedLicenceValues = (licence) => {
  switch (licence) {
    case 'Should be in place by 31 October 2024':
      return 'Applied for'
    case 'Secured':
      return 'Approved'
    default:
      return 'Not needed'
  }
}

function calculateBusinessSize (employees) {
  const employeesNum = Number(employees)

  switch (true) {
    case (employeesNum < 10):
      return 'Micro'
    case (employeesNum < 50):
      return 'Small'
    case (employeesNum < 250):
      return 'Medium'
    default:
      return 'Large'
  }
}

function addAgentDetails (agentDetails) {
  return [
    generateRow(26, 'Agent Surname', agentDetails?.lastName ?? ''),
    generateRow(27, 'Agent Forename', agentDetails?.firstName ?? ''),
    generateRow(29, 'Agent Address line 1', agentDetails?.address1 ?? ''),
    generateRow(30, 'Agent Address line 2', agentDetails?.address2 ?? ''),
    generateRow(32, 'Agent Address line 4 (town)', agentDetails?.town ?? ''),
    generateRow(33, 'Agent Address line 5 (County)', agentDetails?.county ?? ''),
    generateRow(34, 'Agent Postcode (use capitals)', agentDetails?.postcode ?? ''),
    generateRow(35, 'Agent Landline number', agentDetails?.landline ?? ''),
    generateRow(36, 'Agent Mobile number', agentDetails?.mobile ?? ''),
    generateRow(37, 'Agent Email', agentDetails?.emailAddress ?? ''),
    generateRow(28, 'Agent Business Name', agentDetails?.businessName ?? '')
  ]
}

function generateExcelFilename (scheme, projectName, businessName, referenceNumber, today) {
  const dateTime = new Intl.DateTimeFormat('en-GB', {
    timeStyle: 'short',
    dateStyle: 'short',
    timeZone: 'Europe/London'
  }).format(today).replace(/\//g, '-')
  return `${scheme}_${projectName}_${businessName}_${referenceNumber}_${dateTime}.xlsx`
}

function getSpreadsheetDetails (submission, desirabilityScore) {
  const today = new Date()
  const todayStr = today.toLocaleDateString('en-GB')
  const subScheme = 'FTF-Water-Round 2'
  submission.project = ''
  return {
    filename: generateExcelFilename(
      subScheme.trim(),
      submission.businessDetails.projectName.trim(),
      submission.businessDetails.businessName.trim(),
      submission.confirmationId.trim(),
      today
    ),
    uploadLocation: `Farming Investment Fund/Farming Transformation Fund/${spreadsheetConfig.uploadEnvironment}/Water/`,
    worksheets: [
      {
        title: 'DORA DATA',
        ...(spreadsheetConfig.protectEnabled ? { protectPassword: spreadsheetConfig.protectPassword } : {}),
        hideEmptyRows: spreadsheetConfig.hideEmptyRows,
        defaultColumnWidth: 30,
        rows: [
          generateRow(1, 'Field Name', 'Field Value', true),
          generateRow(2, 'FA or OA', 'Outline Application'),
          generateRow(40, 'Scheme', 'Farming Transformation Fund'),
          generateRow(39, 'Sub scheme', subScheme),
          generateRow(43, 'Theme', 'Water Resource Management'),
          generateRow(90, 'Project type', 'Water management'),
          generateRow(41, 'Owner', 'RD'),
          generateRow(341, 'Grant Application Window', ''),
          generateRow(53, 'Business Type', farmingTypeMapping(submission.farmingType)),
          generateRow(23, 'Status of applicant', submission.legalStatus),
          generateRow(376, 'Project Started', submission.projectStarted),
          generateRow(45, 'Location of project (postcode)', submission.farmerDetails.projectPostcode),
          generateRow(342, 'Land owned by Farm', submission.landOwnership),
          generateRow(343, 'Tenancy for next 5 years', submission.tenancyLength ?? ''),
          generateRow(55, 'Total project expenditure', String(submission.projectCost.toFixed(2))),
          generateRow(57, 'Grant rate', '40'),
          generateRow(56, 'Grant amount requested', submission.calculatedGrant),
          generateRow(345, 'Remaining Cost to Farmer', submission.remainingCost),
          generateRow(346, 'Planning Permission Status', getMappedLicenceValues(submission.planningPermission)),
          generateRow(347, 'Abstraction License Status', getMappedLicenceValues(submission.abstractionLicence)),
          generateRow(348, 'Irrigation Impact', ''),
          generateRow(349, 'Irrigation Impact Score', ''),
          generateRow(350, 'Irrigation Farming Scale (AKA Crop Type)', submission.irrigatedCrops),
          generateRow(351, 'Irrigation Crop Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigated-land')),
          generateRow(352, 'As-Is Irrigation (ha)', submission.irrigatedLandCurrent),
          generateRow(353, 'To-Be Irrigation (ha)', submission.irrigatedLandTarget),
          generateRow(354, 'Irrigation Hectare Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigated-land')),
          generateRow(355, 'As-Is Water Source', [submission.waterSourceCurrent].flat().join('|')),
          generateRow(356, 'To-Be Water Source', [submission.waterSourcePlanned].flat().join('|')),
          generateRow(357, 'Water Source Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'water-source')),
          generateRow(358, 'As-Is Irrigation Method', [submission.irrigationCurrent].flat().join('|')),
          generateRow(359, 'To-Be Irrigation Method', [submission.irrigationPlanned].flat().join('|')),
          generateRow(360, 'Irrigation Method Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigation-system')),
          generateRow(361, 'Irrigation Productivity Benefit', [submission.productivity].flat().join('|')),
          generateRow(362, 'Irrigation Productivity Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'productivity')),
          generateRow(363, 'Benefits Other Farms', submission.collaboration),
          generateRow(364, 'Other Farms Benefit Score', getQuestionScoreBand(desirabilityScore.desirability.questions, 'collaboration')),
          generateRow(365, 'OA score', desirabilityScore.desirability.overallRating.band),
          generateRow(366, 'Date of OA decision', ''),
          generateRow(42, 'Project name', submission.businessDetails.projectName),
          generateRow(4, 'Single business identifier (SBI)', submission.businessDetails.sbi || '000000000'),
          generateRow(7, 'Business name', submission.businessDetails.businessName),
          generateRow(367, 'Annual Turnover', submission.businessDetails.businessTurnover),
          generateRow(22, 'Employees', submission.businessDetails.numberEmployees),
          generateRow(20, 'Business size', calculateBusinessSize(submission.businessDetails.numberEmployees, submission.businessDetails.businessTurnover)),
          generateRow(44, 'Description of project', [submission.projectItemsList].flat().join('|')),
          generateRow(91, 'Are you an AGENT applying on behalf of your customer', submission.applying === 'Agent' ? 'Yes' : 'No'),
          generateRow(5, 'Surname', submission.farmerDetails.lastName),
          generateRow(6, 'Forename', submission.farmerDetails.firstName),
          generateRow(25, 'Main applicant gender', 'Applicant preferred not to say'),
          generateRow(24, 'Main applicant age', 'Applicant preferred not to say'),
          generateRow(8, 'Address line 1', submission.farmerDetails.address1),
          generateRow(9, 'Address line 2', submission.farmerDetails.address2),
          generateRow(11, 'Address line 4 (town)', submission.farmerDetails.town),
          generateRow(12, 'Address line 5 (county)', submission.farmerDetails.county),
          generateRow(13, 'Postcode (use capitals)', submission.farmerDetails.businessPostcode),
          generateRow(16, 'Landline number', submission.farmerDetails.landline),
          generateRow(17, 'Mobile number', submission.farmerDetails.mobile),
          generateRow(18, 'Email', submission.farmerDetails.emailAddress),
          generateRow(89, 'Customer Marketing Indicator', submission.consentOptional ? 'Yes' : 'No'),
          generateRow(368, 'Date ready for QC or decision', todayStr),
          generateRow(369, 'Eligibility Reference No.', submission.confirmationId),
          generateRow(403, 'Summer Change', submission.summerAbstractChange ?? ''),
          generateRow(404, 'Mains Change', submission.mainsChange ?? ''),
          generateRow(94, 'Current location of file', 'NA Automated'),
          generateRow(92, 'RAG rating', 'Green'),
          generateRow(93, 'RAG date reviewed ', todayStr),
          generateRow(54, 'Electronic OA received date ', todayStr),
          generateRow(370, 'Status', 'Pending RPA review'),
          generateRow(371, 'Rationale', ''),
          generateRow(372, 'Decision maker', ''),
          generateRow(85, 'Full Application Submission Date', (new Date('October 31, 2024').toLocaleDateString('en-GB'))),
          generateRow(95, 'Measure table', '99'),
          generateRow(96, 'Measure year', '99'),
          generateRow(375, 'OA percent', String(desirabilityScore.desirability.overallRating.score)),
          generateRow(49, 'Site of Special Scientific Interest (SSSI)', ''),
          ...addAgentDetails(submission.agentDetails)
        ]
      }
    ]
  }
}

function getScoreChance (rating) {
  switch (rating.toLowerCase()) {
    case 'strong':
      return 'seems likely to'
    case 'average':
      return 'might'
    default:
      return 'seems unlikely to'
  }
}

function getEmailDetails (submission, desirabilityScore, notifyTemplate, agentApplying, rpaEmail) {
  const email = agentApplying ? submission.agentDetails.emailAddress : submission.farmerDetails.emailAddress
  submission.project = ''

  return {
    notifyTemplate: emailConfig.notifyTemplate,
    emailAddress: rpaEmail || email,
    details: {
      firstName: agentApplying ? submission.agentDetails.firstName : submission.farmerDetails.firstName,
      lastName: agentApplying ? submission.agentDetails.lastName : submission.farmerDetails.lastName,
      referenceNumber: submission.confirmationId,
      overallRating: desirabilityScore.desirability.overallRating.band,
      scoreChance: getScoreChance(desirabilityScore.desirability.overallRating.band),
      crops: submission.farmingType,
      legalStatus: submission.legalStatus,
      location: `England ${submission.farmerDetails.projectPostcode}`,
      landOwnership: submission.landOwnership,
      tenancyAgreement: submission.tenancyLength ?? 'N/A',
      infrastructureEquipment: [submission.projectInfrastucture].flat().join(', '),
      irrigationEquipment: [submission.projectEquipment].flat().join(', '),
      technology: [submission.projectTechnology].flat().join(', '),
      itemsCost: String(submission.projectCost),
      potentialFunding: submission.calculatedGrant,
      remainingCost: submission.remainingCost,
      projectStarted: submission.projectStarted,
      planningPermission: submission.planningPermission,
      abstractionLicence: submission.abstractionLicence,
      projectName: submission.businessDetails.projectName,
      projectDetails: [submission.project].flat().join(', '),
      projectDetailsScore: 'Strong',
      irrigatedCrops: submission.irrigatedCrops,
      irrigatedCropsScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigated-land'),
      summerAbstractChange: submission.summerAbstractChange ?? 'N/A',
      mainsChange: submission.mainsChange ?? 'N/A',
      currentlyIrrigating: submission.currentlyIrrigating ?? 'N/A',
      summerAbstractionMains: submission.summerAbstractionMains,
      isCurrentlyIrrigating: submission.currentlyIrrigating === 'Yes',
      notCurrentlyIrrigating: submission.currentlyIrrigating === `No`,
      irrigatedLandCurrent: submission.irrigatedLandCurrent > 0 ? submission.irrigatedLandCurrent + ' ha' : 'N/A',
      irrigatedLandTarget: submission.irrigatedLandTarget + ' ha',
      irrigatedLandScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigated-land'),
      waterSourceCurrent: [submission.waterSourceCurrent].flat().join(', '),
      waterSourcePlanned: [submission.waterSourcePlanned].flat().join(', '),
      waterSourceScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'water-source'),
      irrigationCurrent: [submission.irrigationCurrent].flat().join(', '),
      irrigationPlanned: [submission.irrigationPlanned].flat().join(', '),
      irrigationScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'irrigation-system'),
      productivity: [submission.productivity].flat().join(', '),
      productivityScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'productivity'),
      collaboration: submission.collaboration,
      collaborationScore: getQuestionScoreBand(desirabilityScore.desirability.questions, 'collaboration'),
      businessName: submission.businessDetails.businessName,
      farmerName: submission.farmerDetails.firstName,
      farmerSurname: submission.farmerDetails.lastName,
      agentName: submission.agentDetails?.firstName ?? 'N/A',
      agentSurname: submission.agentDetails?.lastName ?? ' ',
      agentBusinessName: submission.agentDetails?.businessName ?? 'N/A',
      farmerEmail: submission.farmerDetails.emailAddress,
      agentEmail: submission.agentDetails?.emailAddress ?? 'N/A',
      contactConsent: submission.consentOptional ? 'Yes' : 'No',
      scoreDate: new Date().toLocaleDateString('en-GB')

    }
  }
}

function getAgentEmailDetails (submission, desirabilityScore) {
  if (submission.applying === 'Agent') {
    return getEmailDetails(submission, desirabilityScore, emailConfig.notifyTemplate, true, false)
  }

  return null
}

function getApplicantEmailDetails (submission, desirabilityScore) {
  return getEmailDetails(submission, desirabilityScore, emailConfig.notifyTemplate, false, false)
}

function getRPAEmailDetails (submission, desirabilityScore) {
  return getEmailDetails(submission, desirabilityScore, emailConfig.notifyTemplate, false, spreadsheetConfig.rpaEmail)
}

module.exports = function (submission, desirabilityScore,rating='') {
  return {
    applicantEmail: getApplicantEmailDetails(submission, desirabilityScore),
    agentEmail: getAgentEmailDetails(submission, desirabilityScore),
    rpaEmail: spreadsheetConfig.sendEmailToRpa ? getRPAEmailDetails(submission, desirabilityScore) : '',
    spreadsheet: getSpreadsheetDetails(submission, desirabilityScore),
    getScoreChance:getScoreChance(rating)
  }
}
