
afterEach(() => {
  jest.clearAllMocks()
})
describe('Upload to sharepoint tests', () => {
  jest.mock('../../../../../app/services/protective-monitoring-service')
  jest.mock('../../../../../app/config/sharepoint')
  jest.mock('../../../../../app/config/blobStorage')
  jest.mock('@hapi/wreck')
  const wreck = require('@hapi/wreck')
  wreck.put = jest.fn(async (url, data) => { return null })
  const mockSendEvent = jest.fn()
  const appInsights = require('../../../../../app/services/app-insights')
  appInsights.logException = jest.fn((_err, _sessionId) => {})
  jest.mock('ffc-protective-monitoring', () => {
    return {
      PublishEvent: jest.fn().mockImplementation(() => {
        return { sendEvent: mockSendEvent }
      })
    }
  })
  const fileCreatedReceiver = {
    completeMessage: jest.fn(async (message) => { return null }),
    abandonMessage: jest.fn(async (message) => { return null })
  }
  test('Should be defined', () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint).toBeDefined()
  })
  test('Should not throw error', () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    expect(uploadToSharepoint('', fileCreatedReceiver)).toBeDefined()
  })
  test('Should throw error', async () => {
    const uploadToSharepoint = require('../../../../../app/messaging/upload-to-sharepoint')
    await expect(uploadToSharepoint('', null)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
  })
})
