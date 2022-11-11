const { sendMessage, receiveMessage } = require('../')
const { scoreRequestQueue, fetchWaterScoreRequestMsgType, waterScoreResponseQueue } = require('../../config/messaging.js')

async function getWaterScoring(sessionId) {
	console.log('[MADE IT TO MESSAGE]', sessionId)
	await sendMessage({}, fetchWaterScoreRequestMsgType, scoreRequestQueue, { sessionId })

	console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
	return receiveMessage(sessionId, waterScoreResponseQueue)
}

module.exports = {
	getWaterScoring
}
