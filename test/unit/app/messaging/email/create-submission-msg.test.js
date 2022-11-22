const agentSubmission = require('./submission-agent.json')
const farmerSubmission = require('./submission-farmer.json')
const desirabilityScore = require('./desirability-score.json')

describe('Create submission message', () => {
  const mockPassword = 'mock-pwd'
  
  jest.mock('../../../../../app/messaging/email/config/email', () => ({
    notifyTemplate: 'mock-template'
  }))
  jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => {
      return {
          hideEmptyRows: true,
          protectEnabled: true,
          sendEmailToRpa: true,
          rpaEmail: 'FTF@rpa.gov.uk',
          protectPassword: mockPassword
        }
      });
      
  const createMsg = require('../../../../../app/messaging/email/create-submission-msg')


  beforeEach(() => {
    jest.resetModules()
  })

  test('Farmer submission generates correct message payload', () => {
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.email)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')
    expect(msg.agentEmail).toBe(null)
  })

  test('Farmer submission generates message payload without RPA email when config is Flase', () => {
    jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    const msg = createMsg(farmerSubmission, desirabilityScore)
    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.applicantEmail.emailAddress).toBe(farmerSubmission.farmerDetails.email)
    expect(msg.rpaEmail.emailAddress).toBeFalsy
    expect(msg.agentEmail).toBe(null)
  })

  test('Agent submission generates correct message payload', () => {
    jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: true,
      sendEmailToRpa: true,
      protectPassword: mockPassword
    }))
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg).toHaveProperty('agentEmail')
    expect(msg).toHaveProperty('applicantEmail')
    expect(msg).toHaveProperty('rpaEmail')
    expect(msg).toHaveProperty('spreadsheet')
    expect(msg.agentEmail.emailAddress).toBe(agentSubmission.agentDetails.email)
    expect(msg.applicantEmail.emailAddress).toBe(agentSubmission.farmerDetails.email)
    expect(msg.rpaEmail.emailAddress).toBe('FTF@rpa.gov.uk')

  })


  test('Email part of message should have correct properties', () => {
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.applicantEmail).toHaveProperty('notifyTemplate')
    expect(msg.applicantEmail).toHaveProperty('emailAddress')
    expect(msg.applicantEmail).toHaveProperty('details')
    expect(msg.applicantEmail.details).toHaveProperty(
      'firstName', 'lastName', 'referenceNumber', 'overallRating', 'crops', 'legalStatus',
      'location', 'landOwnership', 'tenancyAgreement', 'infrastructureEquipment',
      'irrigationEquipment', 'technology', 'itemsCost', 'potentialFunding', 'remainingCost',
      'projectStarted', 'planningPermission', 'abstractionLicence', 'projectName',
      'projectDetails', 'projectDetailsScore', 'irrigatedCrops', 'irrigatedLandCurrent',
      'irrigatedLandTarget', 'irrigatedLandScore', 'waterSourceCurrent', 'waterSourcePlanned',
      'waterSourceScore', 'irrigationCurrent', 'irrigationPlanned', 'irrigationScore',
      'productivity', 'productivityScore', 'collaboration', 'collaborationScore', 'sssi', 'businessName',
      'farmerName', 'farmerSurname', 'agentName', 'agentSurname', 'farmerEmail', 'agentEmail',
      'contactConsent', 'scoreDate'
    )
  })

  test('Spreadsheet part of message should have correct properties', () => {
    const msg = createMsg(agentSubmission, desirabilityScore)

    expect(msg.spreadsheet).toHaveProperty('filename')
    expect(msg.spreadsheet).toHaveProperty('uploadLocation')
    expect(msg.spreadsheet).toHaveProperty('worksheets')
    expect(msg.spreadsheet.worksheets.length).toBe(1)
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('title')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('hideEmptyRows')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('defaultColumnWidth')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('protectPassword')
    expect(msg.spreadsheet.worksheets[0]).toHaveProperty('rows')
    expect(msg.spreadsheet.worksheets[0].rows.length).toBe(85)
  })

  test('Protect password property should not be set if config is false', () => {
    jest.mock('../../../../../app/messaging/email/config/spreadsheet', () => ({
      hideEmptyRows: true,
      protectEnabled: false,
      sendEmailToRpa: false,
      protectPassword: mockPassword
    }))
    const createSubmissionMsg = require('../../../../../app/messaging/email/create-submission-msg')
    const msg = createSubmissionMsg(agentSubmission, desirabilityScore)
    expect(msg.spreadsheet.worksheets[0]).not.toHaveProperty('protectPassword')
  })

  test('Unknown farming type produces error string', () => {
    farmerSubmission.farmingType = 'bad value'
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 53).values[2]).toBe('Error: failed to map farming type')
  })

  test('Under 10 employees results in micro business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 1
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Micro')
  })

  test('Under 50 employees results in small business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 10
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Small')
  })

  test('Under 250 employees results in medium business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 50
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Medium')
  })

  test('Over 250 employees results in large business definition', () => {
    farmerSubmission.businessDetails.numberEmployees = 250
    farmerSubmission.businessDetails.businessTurnover = 1
    const msg = createMsg(farmerSubmission, desirabilityScore)

    expect(msg.spreadsheet.worksheets[0].rows.find(r => r.row === 20).values[2]).toBe('Large')
  })
})
