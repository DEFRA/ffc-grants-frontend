const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const Wreck = require('@hapi/wreck')
const questionBank = require('../config/question-bank')
const pollingConfig = require('../config/polling')
function createModel (errorMessage, errorSummary, data) {
  return {
    backLink: '/collaboration',
    ...errorSummary ? { errorList: errorSummary } : {},
    ...data,
    ...(errorMessage ? { errorMessage: { text: errorMessage } } : {}),
    nextlink: '/business-details'
  }
}

async function getResult (correlationId) {
  const url = `${pollingConfig.host}/desirability-score?correlationId=${correlationId}`

  for (let i = 0; i < pollingConfig.retries; i++) {
    await new Promise(resolve => setTimeout(resolve, pollingConfig.interval))
    try {
      const response = await Wreck.get(url, { json: true })

      switch (response.res.statusCode) {
        case 202:
          console.log('202 received, backend didn\'t have result, continue polling')
          break
        case 200:
          console.log('200 received, got result from backend, stop polling')
          return response.payload
        default:
          console.log('Unhandled status code, stop polling')
          return null
      }
    } catch (err) {
      // 4xx and 5xx errors will be caught here along with failure to connect
      console.log(`${err}`)
      return null
    }
  }

  console.log(`Tried getting score ${pollingConfig.retries} times, giving up`)
  return null
}

module.exports = [{
  method: 'GET',
  path: '/score',
  handler: async (request, h) => {
    try {
      // Always re-calculate our score before rendering this page
      await senders.sendProjectDetails(createMsg.getDesirabilityAnswers(request), request.yar.id)

      // Poll for backend for results from scoring algorithm
      // If msgData is null then 500 page will be triggered when trying to access object below
      const msgData = await getResult(request.yar.id)
      if (msgData) {
        const questions = msgData.desirability.questions.map(question => {
          const bankQuestion = questionBank.questions.filter(x => x.key === question.key)[0]
          question.title = bankQuestion.title
          question.desc = bankQuestion.desc ?? ''
          question.url = bankQuestion.url
          question.unit = bankQuestion?.unit
          question.pageTitle = bankQuestion.pageTitle
          question.fundingPriorities = bankQuestion.fundingPriorities
          if (question.key === 'Q20') {
            question.rating.band = ''
          }
          return question
        })
        let scoreChance = 'low'
        switch (msgData.desirability.overallRating.band.toLowerCase()) {
          case 'strong':
            scoreChance = 'high'
            break
          case 'average':
            scoreChance = 'medium'
            break
          default:
            scoreChance = 'low'
            break
        }
        return h.view('score', createModel(null, null, {
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions,
          scoreChance: scoreChance
        }))
      } else {
        return h.view('500')
      }
    } catch {
      return h.view('500')
    }
  }
},
{
  method: 'POST',
  path: '/score',
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect('./business-details')
  }
}]
