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

const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

const config = {
  eligibilityAnswersQueue: {
    address: process.env.ELIGIBILITY_ANSWERS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  projectDetailsQueue: {
    address: process.env.PROJECT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  contactDetailsQueue: {
    address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  eligibilityAnswersMsgType: `${msgTypePrefix}.eligibility.details`,
  projectDetailsMsgType: `${msgTypePrefix}.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.contact.details`,
  msgSrc: 'ffc-grants-frontend'
}

// Validate config
// const result = schema.validate(config, {
//   abortEarly: false
// })

// // Throw if config is invalid
// if (result.error) {
//   throw new Error(`The message config is invalid. ${result.error.message}`)
// }

// module.exports = result.value

module.exports = config
