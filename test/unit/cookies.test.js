const cookies = require('../../app/cookies')
let request
let h
const defaultCookie = { confirmed: false, essential: true, analytics: false }

describe('cookies', () => {
  beforeEach(() => {
    request = {
      state: {
        cookies_policy: undefined
      }
    }
    h = {
      state: jest.fn()
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('getCurrentPolicy returns default cookie if does not exist', () => {
    const result = cookies.getCurrentPolicy(request, h)
    expect(result).toStrictEqual(defaultCookie)
  })

  test('getCurrentPolicy sets default cookie if does not exist', () => {
    cookies.getCurrentPolicy(request, h)
    expect(h.state).toHaveBeenCalledWith('cookies_policy', defaultCookie, expect.anything())
  })

  test('getCurrentPolicy returns cookie if exists', () => {
    request.state.cookies_policy = { confirmed: true, essential: false, analytics: true }
    const result = cookies.getCurrentPolicy(request, h)
    expect(result).toStrictEqual({ confirmed: true, essential: false, analytics: true })
  })

  test('getCurrentPolicy does not set default cookie if exists', () => {
    request.state.cookies_policy = { confirmed: true, essential: false, analytics: true }
    cookies.getCurrentPolicy(request, h)
    expect(h.state).not.toHaveBeenCalled()
  })

  test('updatePolicy sets cookie twice if does not exist', () => {
    cookies.updatePolicy(request, h, true)
    expect(h.state).toHaveBeenCalledTimes(2)
  })

  test('updatePolicy sets confirmed cookie second if does not exist', () => {
    cookies.updatePolicy(request, h, true)
    expect(h.state).toHaveBeenNthCalledWith(2, 'cookies_policy', { confirmed: true, essential: true, analytics: true }, expect.anything())
  })

  test('updatePolicy sets cookie to accepted', () => {
    request.state.cookies_policy = { confirmed: false, essential: true, analytics: false }
    cookies.updatePolicy(request, h, true)
    expect(h.state).toHaveBeenCalledWith('cookies_policy', { confirmed: true, essential: true, analytics: true }, expect.anything())
  })

  test('updatePolicy sets cookie to rejected', () => {
    request.state.cookies_policy = { confirmed: false, essential: true, analytics: false }
    cookies.updatePolicy(request, h, false)
    expect(h.state).toHaveBeenCalledWith('cookies_policy', { confirmed: true, essential: true, analytics: false }, expect.anything())
  })
})
