const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

module.exports = {
  fileCreatedSubscription: {
    address: process.env.FILE_CREATED_SUBSCRIPTION_ADDRESS,
    topic: process.env.FILE_CREATED_TOPIC_ADDRESS,
    type: 'subscription',
    ...sharedConfig
  },
  msgSrc: 'ffc-grants-file-sender'
}
