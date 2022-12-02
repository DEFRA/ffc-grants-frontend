const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  hideEmptyRows: Joi.bool().default(false),
  protectEnabled: Joi.bool().default(false),
  sendEmailToRpa: Joi.bool().default(false),
  protectPassword: Joi.string(),
  rpaEmail: Joi.string().default('FTF@rpa.gov.uk'),
  uploadEnvironment: Joi.string().required()
})

// Build config
const config = {
  hideEmptyRows: process.env.WORKSHEET_HIDE_EMPTY_ROWS === 'true',
  protectEnabled: process.env.WORKSHEET_PROTECT_ENABLED === 'true',
  sendEmailToRpa: process.env.SEND_EMAIL_TO_RPA === 'true',
  protectPassword: process.env.WORKSHEET_PROTECT_PASSWORD,
  rpaEmail: process.env.RPA_EMAIL_ADDRESS,
  uploadEnvironment: process.env.EXCEL_UPLOAD_ENVIRONMENT
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The spreadsheet config is invalid. ${result.error.message}`)
}

module.exports = result.value
