const { MessageSender } = require('ffc-messaging')

const sendSessionMessage = require('../../../../app/messaging/send-message')

describe('application messaging tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendMessage sends a message', async () => {
    const body = { applicationReference: '12345' }
    const type = 'test'
    const config = { queue: 'yes' }
    const sessionId = { id: 1 }

    jest.spyOn(MessageSender.prototype, 'sendMessage').mockImplementationOnce(() => Promise.resolve(true))
    jest.spyOn(MessageSender.prototype, 'closeConnection').mockImplementationOnce(() => Promise.resolve(true))

    await sendSessionMessage(body, type, config, sessionId)

    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalledTimes(1)
  })

  test('sendMessage throws error if issue when sending message', async () => {
    const body = { applicationReference: '12345' }
    const type = 'test'
    const config = { queue: 'yes' }
    const sessionId = { id: 1 }

    jest.spyOn(MessageSender.prototype, 'sendMessage').mockImplementationOnce(() => { throw new Error('new error') })

    await expect(sendSessionMessage(body, type, config, sessionId)).rejects.toThrow('new error')
  })
})
