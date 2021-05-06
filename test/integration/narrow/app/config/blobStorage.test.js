describe('Config blobStorage', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('Valid env vars pass validation and are set', () => {
    const mockconnectionStr = 'mock-connectionStr'
    const mockcontainerName = 'mock-containerName'
    process.env.BLOB_STORAGE_CONNECTION_STRING = mockconnectionStr
    process.env.BLOB_STORAGE_CONTAINER_NAME = mockcontainerName
    const spreadsheetConfig = require('../../../../../app/config/blobStorage')
    expect(spreadsheetConfig.connectionStr).toBe(mockconnectionStr)
    expect(spreadsheetConfig.containerName).toBe(mockcontainerName)
  })

  test('Connection String undefined throws error', () => {
    process.env.BLOB_STORAGE_CONNECTION_STRING = undefined
    expect(() => require('../../../../../app/config/blobStorage')).toThrow()
  })

  test('Connection Name undefined throws error', () => {
    process.env.BLOB_STORAGE_CONTAINER_NAME = undefined
    expect(() => require('../../../../../app/config/blobStorage')).toThrow()
  })
})
