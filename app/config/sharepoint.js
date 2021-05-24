const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  tenantId: Joi.string().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  hostname: Joi.string().required(),
  sitePath: Joi.string().required(),
  documentLibrary: Joi.string().required()
})

// Build config
const config = {
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
  hostname: process.env.SHAREPOINT_HOSTNAME,
  sitePath: process.env.SHAREPOINT_SITE_PATH,
  documentLibrary: process.env.SHAREPOINT_DOCUMENT_LIBRARY
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The sharepoint config is invalid. ${result.error.message}`)
}

module.exports = result.value
