const Joi = require('joi')
// Define config schema
const schema = Joi.object({
  interval: Joi.number().default(60),
  retries: Joi.number().default(10),
  host: Joi.string() // .required()

})

// Build config
const config = {
  interval: process.env.POLLING_INTERVAL,
  retries: process.env.POLLING_RETRIES,
  host: process.env.BACKEND_POLLING_HOST
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The server config is invalid. ${result.error.message}`)
}

// Use the Joi validated value
const value = result.value

module.exports = value
