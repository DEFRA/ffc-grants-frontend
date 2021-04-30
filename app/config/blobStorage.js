const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  connectionStr: Joi.string().required(),
  containerName: Joi.string().required()
})

// Build config
const config = {
  connectionStr: process.env.BLOB_STORAGE_CONNECTION_STRING,
  containerName: process.env.BLOB_STORAGE_CONTAINER_NAME
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
