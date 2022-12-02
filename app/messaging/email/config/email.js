const Joi = require('joi')


// Define config schema
const schema = Joi.object({
  notifyTemplate: Joi.string().required()
})

// Build config
const config = {
  notifyTemplate: process.env.NOTIFY_EMAIL_TEMPLATE
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The email config is invalid. ${result.error.message}`)
}

module.exports = result.value
