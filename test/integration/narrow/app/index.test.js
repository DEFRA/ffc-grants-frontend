jest.mock('../../../../app/server')
jest.mock('../../../../app/messaging/receivers')
jest.mock('../../../../app/messaging/upload-to-sharepoint')
jest.mock('../../../../app/services/sharepoint.js')
const { setup } = require('../../../../app/services/app-insights')
jest.mock('../../../../app/services/app-insights')
const server = require('../../../../app/server')
server.start = jest.fn(async () => { })
const receivers = require('../../../../app/messaging/receivers')

receivers.startFileCreatedReceiver = jest.fn((a) => {})
const indexInit = require('../../../../app/index')

// mock sharepoint.js


afterEach(() => {
  jest.clearAllMocks()
})
describe('get indexInit setup defined', () => {
  test('Should be defined', () => {
    expect(indexInit).toBeDefined()
  })
  test('Should call setup once', async () => {
    expect(require('../../../../app/index')).toEqual({})
    expect(setup).toHaveBeenCalledTimes(0)
  })
})
