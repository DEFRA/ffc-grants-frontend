const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  type: 'queue',
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

module.exports = {
  testQueue: {
    address: process.env.TEST_QUEUE_ADDRESS,
    ...sharedConfig
  },
  testMsgType: `${msgTypePrefix}.test.test`,
  msgSrc: 'ffc-grants-frontend'
}
