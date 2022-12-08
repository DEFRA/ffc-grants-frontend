const { getDesirabilityAnswers } = require('../messaging/create-msg')
const questionBank = require('../config/question-bank')
const gapiService = require('../services/gapi-service')
const { setYarValue, getYarValue } = require('../helpers/session')
const { addSummaryRow } = require('../helpers/score-helpers')
const { getWaterScoring } = require('../messaging/application')

const createMsg = require('./../messaging/scoring/create-desirability-msg')


const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'score'
const currentPath = `${urlPrefix}/${viewTemplate}`
const previousPath = `${urlPrefix}/collaboration`
const nextPath = `${urlPrefix}/business-details`
const startPath = `${urlPrefix}/start`

function createModel (data) {
  return {
    backLink: previousPath,
    formActionPage: currentPath,
    ...data
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  options: {
    log: {
      collect: true
    }
  },
  handler: async (request, h, err) => {
    console.log('here: ', request);
    if (!getYarValue(request, 'current-score') && !getYarValue(request, 'collaboration')) {
      return h.redirect(startPath)
    }
    try {
      const msgDataToSend = getDesirabilityAnswers(request)
      // Always re-calculate our score before rendering this page

      // call session queue to send score data
      const formatAnswersForScoring = createMsg(msgDataToSend)
      const msgData = await getWaterScoring(formatAnswersForScoring, request.yar.id)
      setYarValue(request, 'overAllScore', msgData)
      console.log('msgData from Score: ', msgData);
      console.log('getYar overAllScore: ', getYarValue(request, 'overAllScore'));
      const crop = questionBank.questions.find(question => question.key === 'Q15')
      const cropObject = addSummaryRow(crop, request)
      if (msgData) {
        msgData.desirability.questions.push(cropObject)
        const questions = msgData.desirability.questions.map(desirabilityQuestion => {
          const bankQuestion = questionBank.questions.filter(bankQuestionD => bankQuestionD.key === desirabilityQuestion.key)[0]
          desirabilityQuestion.title = bankQuestion.title
          desirabilityQuestion.desc = bankQuestion.desc ?? ''
          desirabilityQuestion.url = `${urlPrefix}/${bankQuestion.url}`
          desirabilityQuestion.order = bankQuestion.order
          desirabilityQuestion.unit = bankQuestion?.unit
          desirabilityQuestion.pageTitle = bankQuestion.pageTitle
          desirabilityQuestion.fundingPriorities = bankQuestion.fundingPriorities
          return desirabilityQuestion
        })
        let scoreChance
        switch (msgData.desirability.overallRating.band.toLowerCase()) {
          case 'strong':
            scoreChance = 'is likely to'
            break
          case 'average':
            scoreChance = 'might'
            break
          default:
            scoreChance = 'is unlikely to'
            break
        }
        setYarValue(request, 'current-score', msgData.desirability.overallRating.band)
        await gapiService.sendDimensionOrMetrics(request, [{
          dimensionOrMetric: gapiService.dimensions.SCORE,
          value: msgData.desirability.overallRating.band
        },
        {
          dimensionOrMetric: gapiService.metrics.SCORE,
          value: 'TIME'
        }])
        return h.view(viewTemplate, createModel({
          titleText: msgData.desirability.overallRating.band,
          scoreData: msgData,
          questions: questions.sort((a, b) => a.order - b.order),
          scoreChance: scoreChance
        }))
      } else {
        throw new Error('Score not received.')
      }
    } catch (error) {
      request.log(error)
      await gapiService.sendEvent(request, gapiService.categories.EXCEPTION, 'Error')
    }
    request.log(err)
    return h.view('500')
  }
},
{
  method: 'POST',
  path: currentPath,
  handler: (request, h) => {
    request.yar.set('score-calculated', true)
    return h.redirect(nextPath)
  }
}]
