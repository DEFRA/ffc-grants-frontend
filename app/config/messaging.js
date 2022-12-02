const Joi = require('joi')

require('dotenv').config()

const sharedConfigSchema = {
  appInsights: Joi.object(),
  host: Joi.string().default('localhost'),
  password: Joi.string(),
  username: Joi.string(),
  useCredentialChain: Joi.bool().default(false)
}

const messageConfigSchema = Joi.object({
  projectDetailsQueue: {
    address: Joi.string().default('projectDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  contactDetailsQueue: {
    address: Joi.string().default('contactDetails'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  scoreRequestQueue: {
    address: Joi.string().default('scoreRequestQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  scoreResponseQueue: {
    address: Joi.string().default('scoreResponseQueue'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  desirabilitySubmittedTopic: {
    address: Joi.string().default('desirabilitySubmittedTopic'),
    type: Joi.string(),
    ...sharedConfigSchema
  },
  desirabilitySubmittedMsgType: Joi.string(),
  eligibilityAnswersMsgType: Joi.string(),
  // fetchScoreRequestMsgType: Joi.string(),
  fetchWaterScoreRequestMsgType: Joi.string(),
  projectDetailsMsgType: Joi.string(),
  contactDetailsMsgType: Joi.string(),
  msgSrc: Joi.string(),
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
  scoreRequestQueue: {
    address: process.env.SCORE_REQUEST_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  scoreResponseQueue: {
    address: process.env.SCORE_RESPONSE_QUEUE_ADDRESS,
    type: 'queue',
    ...sharedConfig
  },
  desirabilitySubmittedTopic: {
    address: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
    type: 'topic',
    ...sharedConfig
  },
  desirabilitySubmittedMsgType: `${msgTypePrefix}.desirability.notification`,
  eligibilityAnswersMsgType: `${msgTypePrefix}.eligibility.details`,
  projectDetailsMsgType: `${msgTypePrefix}.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.contact.details`,
  // fetchScoreRequestMsgType: `${msgTypePrefix}.fetch.score.request`,
  fetchWaterScoreRequestMsgType: `${msgTypePrefix}.fetch.water.score.request`,
  msgSrc: 'ffc-grants-frontend'
}

// Validate config
const result = messageConfigSchema.validate(config, {
  abortEarly: false
})

// // Throw if config is invalid
if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

module.exports = result.value
