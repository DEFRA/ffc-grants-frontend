describe('Config Sharepoint', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('Valid env vars pass validation and are set', () => {
    const mockSitePath = 'mock-sitePath'
    const mockClientId = 'mock-clientId'
    const mockTenantId = 'mock-tenantId'
    const mockClientSecretId = 'mock-clientSecretId'
    const mockDocLib = 'mock-docLib'
    const mockHostname = 'mock-hostname'
    process.env.SHAREPOINT_SITE_PATH = mockSitePath
    process.env.SHAREPOINT_TENANT_ID = mockTenantId
    process.env.SHAREPOINT_CLIENT_ID = mockClientId
    process.env.SHAREPOINT_CLIENT_SECRET = mockClientSecretId
    process.env.SHAREPOINT_DOCUMENT_LIBRARY = mockDocLib
    process.env.SHAREPOINT_HOSTNAME = mockHostname
    const spreadsheetConfig = require('../../../../../app/config/sharepoint')
    expect(spreadsheetConfig.sitePath).toBe(mockSitePath)
    expect(spreadsheetConfig.tenantId).toBe(mockTenantId)
    expect(spreadsheetConfig.clientId).toBe(mockClientId)
    expect(spreadsheetConfig.clientSecret).toBe(mockClientSecretId)
    expect(spreadsheetConfig.documentLibrary).toBe(mockDocLib)
    expect(spreadsheetConfig.hostname).toBe(mockHostname)
  })

  test('Hostname undefined throws error', () => {
    process.env.SHAREPOINT_HOSTNAME = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })

  test('Site undefined throws error', () => {
    process.env.SHAREPOINT_SITE_PATH = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })

  test('Tenant undefined throws error', () => {
    process.env.SHAREPOINT_TENANT_ID = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })

  test('Client Id undefined throws error', () => {
    process.env.SHAREPOINT_CLIENT_ID = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })

  test('Client Secret undefined throws error', () => {
    process.env.SHAREPOINT_CLIENT_SECRET = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })

  test('Doc Lib undefined throws error', () => {
    process.env.SHAREPOINT_DOCUMENT_LIBRARY = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })
})
