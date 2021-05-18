const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionStr: Joi.string().when('useConnectionStr', { is: true, then: Joi.required(), otherwise: Joi.allow('').optional() }),
  storageAccountName: Joi.string().when('useConnectionStr', { is: true, then: Joi.allow('').optional(), otherwise: Joi.required() }),
  containerName: Joi.string().required(),
  useConnectionStr: Joi.boolean().default(false)
})

// Build config
const config = {
  connectionStr: process.env.BLOB_STORAGE_CONNECTION_STRING,
  storageAccountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
  containerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
  useConnectionStr: process.env.USE_BLOB_STORAGE_CONNECTION_STRING
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The blob storage config is invalid. ${result.error.message}`)
}

module.exports = result.value
