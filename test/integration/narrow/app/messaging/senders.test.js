const { sendDesirabilitySubmitted } = require('../../../../../app/messaging/senders')

describe('senders', () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})
	test('should send a message', async () => { 
		const sendMsg = jest.fn()
		const sendMessage = jest.fn()
		const closeConnection = jest.fn()
		const MessageSender = jest.fn(() => {
			return {
				sendMessage,
				closeConnection
			}
		}
		)
		const msgCfg = {
			desirabilitySubmittedTopic: 'desirabilitySubmittedTopic',
			desirabilitySubmittedMsgType: 'desirabilitySubmittedMsgType',
			msgSrc: 'msgSrc'
		}
		const protectiveMonitoringServiceSendEvent = jest.fn()
		const desirabilitySubmittedData = {
			desirabilitySubmittedData: 'desirabilitySubmittedData'
		}
		const correlationId = 'correlationId'
		await sendDesirabilitySubmitted(desirabilitySubmittedData, correlationId, MessageSender, msgCfg, protectiveMonitoringServiceSendEvent, sendMsg)
		expect(MessageSender).toHaveBeenCalledWith(msgCfg.desirabilitySubmittedTopic)
		expect(sendMsg).toHaveBeenCalledWith(
			{
				sendMessage,
				closeConnection
			},
			desirabilitySubmittedData,
			msgCfg.desirabilitySubmittedMsgType,
			correlationId
		)
		expect(protectiveMonitoringServiceSendEvent).toHaveBeenCalledWith(correlationId, 'FTF-DATA-SUBMITTED', '0703')
	 })
})