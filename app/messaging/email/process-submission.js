// const { sendDesirabilitySubmitted } = require('../senders')
const createMsg = require('./create-submission-msg')
const appInsights = require('../../services/app-insights')

module.exports = async function (msg) {
  try {
    const { body: submissionDetails, correlationId, overAllScore } = msg
    console.log('overAllScore - proc subb: ', overAllScore)
    console.log('correlationId - proc sub: ', correlationId)

    console.log('MADE IT TO DETAILS', submissionDetails)

    const msgOut = createMsg(submissionDetails, overAllScore)
    console.log('msgOut - proc sub: ', msgOut)

    return msgOut
  } catch (err) {
    console.error(`[ERROR][UNABLE TO PROCESS DETAILS RECEIVER MESSAGE][${err}]`)
    appInsights.logException(err, msg?.correlationId)
  }
}
