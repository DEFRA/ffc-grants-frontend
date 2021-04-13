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
  path: '/answers',
  handler: async (request, h) => {
    try
    {
      // Always re-calculate our score before rendering this page
      await senders.sendProjectDetails(createMsg.getDesirabilityAnswers(request), request.yar.id)

      // Poll for backend for results from scoring algorithm
      // If msgData is null then 500 page will be triggered when trying to access object below
      const msgData = await getResult(request.yar.id)
      if (msgData) {
        const questions = msgData.desirability.questions.map(q => {
          const questionBankQ = questionBank.questions.filter(x => x.key === q.key)[0]
          q.title = questionBankQ.title
          q.desc = questionBankQ.desc ?? ''
          q.url = questionBankQ.url
          q.unit = questionBank?.unit
          q.pageTitle = questionBankQ.pageTitle
          q.fundingPriorities = questionBankQ.fundingPriorities
          return q
        })
        return h.view('answers', createModel(null, null, {
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions
        }))
      } 
      else {
        return h.view('500')
      }
  }
  catch{
    return h.view('500')
  }
  }
},
{
  method: 'POST',
  path: '/answers',
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect('./business-details')
  }
}]
