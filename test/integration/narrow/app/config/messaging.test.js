describe('Config Messaging', () => {
  const messageConfig = require('../../../../../app/config/messaging')
  test('Check queue and topic subscription defined', () => {
    expect(messageConfig).toBeDefined()
    expect(messageConfig.fileCreatedSubscription).toBeDefined()
    expect(messageConfig.msgSrc).toBe('ffc-grants-file-sender')
  })
})
