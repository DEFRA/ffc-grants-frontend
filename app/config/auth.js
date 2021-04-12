const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  credentials: Joi.object({
    username: Joi.string().default('dummyusername'),
    passwordHash: Joi.string().default('dummypwdhash')
  }),
  cookie: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().default('dummycookiepassworddummycookiepassword'),
    isSecure: Joi.bool().default(true)
  }),
  enabled: Joi.bool().default(false)
})

const config = {
  credentials: {
    username: process.env.AUTH_USERNAME,
    passwordHash: process.env.AUTH_PASSWORD_HASH
  },
  cookie: {
    name: 'session-auth',
    password: process.env.COOKIE_PASSWORD,
    isSecure: process.env.NODE_ENV === 'production'
  },
  enabled: process.env.LOGIN_REQUIRED === 'true'
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The auth config is invalid. ${result.error.message}`)
}

module.exports = result.value
