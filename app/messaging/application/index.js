const { sendMessage, receiveMessage } = require('../')
const { scoreRequestQueue, fetchWaterScoreRequestMsgType, scoreResponseQueue } = require('../../config/messaging.js')

async function getWaterScoring(data, sessionId) {
	console.log('[MADE IT TO MESSAGE]', sessionId)
	await sendMessage(data, fetchWaterScoreRequestMsgType, scoreRequestQueue, { sessionId })

	console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
	return receiveMessage(sessionId, scoreResponseQueue)
}

module.exports = {
	getWaterScoring
}
