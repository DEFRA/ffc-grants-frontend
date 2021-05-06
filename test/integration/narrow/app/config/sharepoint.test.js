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
    const mockSiteId = 'mock-siteId'
    const mockClientId = 'mock-clientId'
    const mockTenantId = 'mock-tenantId'
    const mockClientSecretId = 'mock-clientSecretId'
    const mockDocLibId = 'mock-docLibId'
    process.env.SHAREPOINT_SITE_ID = mockSiteId
    process.env.SHAREPOINT_TENANT_ID = mockTenantId
    process.env.SHAREPOINT_CLIENT_ID = mockClientId
    process.env.SHAREPOINT_CLIENT_SECRET = mockClientSecretId
    process.env.SHAREPOINT_DOCUMENT_LIBRARY_ID = mockDocLibId
    const spreadsheetConfig = require('../../../../../app/config/sharepoint')
    expect(spreadsheetConfig.siteId).toBe(mockSiteId)
    expect(spreadsheetConfig.tenantId).toBe(mockTenantId)
    expect(spreadsheetConfig.clientId).toBe(mockClientId)
    expect(spreadsheetConfig.clientSecret).toBe(mockClientSecretId)
    expect(spreadsheetConfig.documentLibraryId).toBe(mockDocLibId)
  })

  test('Site undefined throws error', () => {
    process.env.SHAREPOINT_SITE_ID = undefined
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
    process.env.SHAREPOINT_DOCUMENT_LIBRARY_ID = undefined
    expect(() => require('../../../../../app/config/sharepoint')).toThrow()
  })
})
