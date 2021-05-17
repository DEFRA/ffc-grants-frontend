const { crumbToken } = require('./test-helper')

describe('Confirmation page', () => {
  beforeEach(async () => {
    jest.mock('../../../../app/messaging')
    jest.mock('ffc-messaging')
  })
  it('should load page successfully', async () => {
    const senders = require('../../../../app/messaging/senders')
    senders.sendContactDetails = jest.fn(async function (model, yarId) {
      throw new Error('Some error')
    })
    // setting yar variable needed  for the confirmation page
    const consentMain = 'CONSENT_MAIN'

    const postOptions = {
      method: 'POST',
      url: '/confirm',
      payload: { consentMain, crumb: crumbToken },
      headers: {
        cookie: 'crumb=' + crumbToken
      }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(302)

    expect(postResponse.request.yar.get('consentMain')).toBe(true)

    const sessionCookie = postResponse.headers['set-cookie']
      .find(line => line.includes('session='))
      .split(' ')
      .find(cookie => cookie.startsWith('session='))

    const options = {
      method: 'GET',
      url: '/confirmation',
      headers: {
        cookie: 'crumb=' + crumbToken + '; ' + sessionCookie
      }
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should redirect page if no consent  is given', async () => {
    const options = {
      method: 'GET',
      url: '/confirmation'
    }
    const senders = require('../../../../app/messaging/senders')
    senders.sendContactDetails = jest.fn(async function (model, yarId) {
      return ''
    })
    const response = await await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('./start')
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
