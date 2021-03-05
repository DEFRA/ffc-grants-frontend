const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

const msgTypePrefix = 'uk.gov.ffc.grants'

module.exports = {
  fixmeQueue: {
    address: process.env.FIXME_QUEUE_ADDRESS,
    type: FIXME,
    ...sharedConfig
  },
  fixmeMsgType: `${msgTypePrefix}.fixme.fixme`,
  msgSrc: 'ffc-grants-frontend'
}

