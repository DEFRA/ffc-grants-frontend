const { sendMessage, receiveMessage } = require('../')
const { scoreRequestQueue, fetchScoreRequestMsgType, scoreResponseQueue } = require('../../config/messaging.js')

async function getWaterScoring(sessionId) {
	console.log('[MADE IT TO MESSAGE]', sessionId)
	await sendMessage({}, fetchScoreRequestMsgType, scoreRequestQueue, { sessionId })

	console.log('[FINISHED SENDING MESSAGE MOVING TO RECEIVING]')
	return receiveMessage(sessionId, scoreResponseQueue)
}

module.exports = {
	getWaterScoring
}
