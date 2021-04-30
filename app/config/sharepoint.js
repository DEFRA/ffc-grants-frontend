const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  siteId: Joi.string().required(),
  tenantId: Joi.string().required(),
  clientId: Joi.string().required(),
  clientSecret: Joi.string().required(),
  documentLibraryId: Joi.string().required()
})

// Build config
const config = {
  siteId: process.env.SHAREPOINT_SITE_ID,
  tenantId: process.env.SHAREPOINT_TENANT_ID,
  clientId: process.env.SHAREPOINT_CLIENT_ID,
  clientSecret: process.env.SHAREPOINT_CLIENT_SECRET,
  documentLibraryId: process.env.SHAREPOINT_DOCUMENT_LIBRARY_ID
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
