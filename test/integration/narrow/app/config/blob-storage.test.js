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
    const mockConnectionStr = 'mock-connectionStr'
    const mockContainerName = 'mock-containerName'
    const mockUseConnectionStr = 'true'
    const mockStorageAccountName = 'mock-storageAccountName'

    process.env.BLOB_STORAGE_CONNECTION_STRING = mockConnectionStr
    process.env.BLOB_STORAGE_CONTAINER_NAME = mockContainerName
    process.env.USE_BLOB_STORAGE_CONNECTION_STRING = mockUseConnectionStr
    process.env.BLOB_STORAGE_ACCOUNT_NAME = mockStorageAccountName

    const spreadsheetConfig = require('../../../../../app/config/blob-storage')
    expect(spreadsheetConfig.connectionStr).toBe(mockConnectionStr)
    expect(spreadsheetConfig.containerName).toBe(mockContainerName)
    expect(spreadsheetConfig.storageAccountName).toBe(mockStorageAccountName)
    expect(spreadsheetConfig.useConnectionStr).toBe(true)
  })

  test('Connection String undefined throws error if using connection string', () => {
    process.env.BLOB_STORAGE_CONNECTION_STRING = undefined
    process.env.USE_BLOB_STORAGE_CONNECTION_STRING = true
    expect(() => require('../../../../../app/config/blob-storage')).toThrow()
  })

  test('Container Name undefined throws error', () => {
    process.env.BLOB_STORAGE_CONTAINER_NAME = undefined
    expect(() => require('../../../../../app/config/blob-storage')).toThrow()
  })

  test('Storage account name undefined throws error when not using connection string', () => {
    process.env.BLOB_STORAGE_ACCOUNT_NAME = undefined
    process.env.USE_BLOB_STORAGE_CONNECTION_STRING = false
    expect(() => require('../../../../../app/config/blob-storage')).toThrow()
  })
})
