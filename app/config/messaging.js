const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

module.exports = {
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
  projectDetailsMsgType: `${msgTypePrefix}.project.details`,
  contactDetailsMsgType: `${msgTypePrefix}.contact.details`,
  msgSrc: 'ffc-grants-frontend'
}
