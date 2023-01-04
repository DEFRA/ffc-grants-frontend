describe('Session', () => {
  test('setYarValue', () => {
    const { setYarValue } = require('../../../../app/helpers/session')
    const dict = {}

    const mockRequest = {
      yar: {
        set: jest.fn((key, value) => {
          dict[key] = value
        })
      }
    }

    expect(dict).toEqual({})
    setYarValue(mockRequest, 'MOCK_KEY', 'MOCK_VALUE')
    expect(dict).toEqual({ MOCK_KEY: 'MOCK_VALUE' })
  })

  test('getYarValue', () => {
    const { getYarValue } = require('../../../../app/helpers/session')
    const dict = { MOCK_KEY: 'MOCK_VALUE' }

    let mockRequest = {}
    expect(getYarValue(mockRequest, 'MOCK_KEY')).toBeNull()

    mockRequest = {
      yar: {
        get: jest.fn((key) => (dict[key]))
      }
    }
    expect(getYarValue(mockRequest, 'MOCK_KEY')).toEqual('MOCK_VALUE')
  })
})
