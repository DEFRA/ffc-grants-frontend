jest.mock('ffc-messaging')
const ffcMessaging = require('ffc-messaging')
ffcMessaging.MessageSender = jest.fn().mockImplementation(() => {
  return {
    closeConnection: jest.fn(),
    sendMessage: jest.fn(async (message) => {})
  }
})
ffcMessaging.MessageReceiver = jest.fn().mockImplementation((queue, updateAction) => {
  return {
    closeConnection: jest.fn(),
    subscribe: jest.fn()
  }
})
describe('messaging tests', () => {
  test('Receiver Should be defined', () => {
    const receivers = require('../../../../../app/messaging/receivers')
    expect(receivers).toBeDefined()
  })
  test('Receiver startCalculateScoreReceiver Should not throw error', async () => {
    const receivers = require('../../../../../app/messaging/receivers')
    await expect(receivers.startFileCreatedReceiver('')).resolves.not.toThrow()
  })
})
