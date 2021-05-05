const senders = require('../messaging/senders')
const createMsg = require('../messaging/create-msg')
const Wreck = require('@hapi/wreck')
const questionBank = require('../config/question-bank')
const pollingConfig = require('../config/polling')
function createModel (data) {
  return {
    backLink: './collaboration',
    ...data
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
  handler: async (request, h, err) => {
    try {
      // Always re-calculate our score before rendering this page
      await senders.sendProjectDetails(createMsg.getDesirabilityAnswers(request), request.yar.id)

      // Poll for backend for results from scoring algorithm
      // If msgData is null then 500 page will be triggered when trying to access object below
      const msgData = await getResult(request.yar.id)
      const crop = questionBank.questions.find(question => question.key === 'Q15')
      const questionObject = {
        key: crop.key,
        answers: [
          {
            key: crop.key,
            title: crop.title,
            input: [{ value: request.yar.get('irrigatedCrops') }]
          }],
        title: crop.title,
        desc: crop.desc ?? '',
        url: crop.url,
        order: 15,
        unit: crop?.unit,
        pageTitle: crop.pageTitle,
        fundingPriorities: crop.fundingPriorities
      }
      if (msgData) {
        msgData.desirability.questions.push(questionObject)

        const questions = msgData.desirability.questions.map(question => {
          const bankQuestion = questionBank.questions.filter(x => x.key === question.key)[0]
          question.title = bankQuestion.title
          question.desc = bankQuestion.desc ?? ''
          question.url = bankQuestion.url
          question.order = bankQuestion.order
          question.unit = bankQuestion?.unit
          question.pageTitle = bankQuestion.pageTitle
          question.fundingPriorities = bankQuestion.fundingPriorities
          return question
        })
        let scoreChance
        switch (msgData.desirability.overallRating.band.toLowerCase()) {
          case 'strong':
            scoreChance = 'seems likely to'
            break
          case 'average':
            scoreChance = 'might'
            break
          default:
            scoreChance = 'seems unlikely to'
            break
        }
        return h.view('score', createModel({
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions.sort((a, b) => a.order - b.order),
          scoreChance: scoreChance
        }))
      } else {
        await request.ga.event({
          category: 'Score',
          action: 'Error'
        })
        return h.view('500')
      }
    } catch (err) {
      await request.ga.event({
        category: 'Score',
        action: 'Error'
      })
      console.error(err)
      return h.view('500')
    }
  }
},
{
  method: 'POST',
  path: '/score',
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect('./next-steps')
  }
}]
