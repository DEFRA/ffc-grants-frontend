/*
* Add an `onPreResponse` listener to add page guard for scoring questions
*/
const questionBank = require('../config/question-bank')
const { getYarValue } = require('../helpers/session')
const { urlPrefix, startPageUrl } = require('../config/server')

module.exports = {
  plugin: {
    name: 'page-guard',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const currentUrl = request.url.pathname.split('/').pop()
        let result
        let score

        if (request.response.variety === 'view' && questionBank.questions.filter(question => question.url === currentUrl).length > 0) {
          const currentQuestionNumber = questionBank.questions.filter(question => question.url === currentUrl)[0].order
          score = (getYarValue(request, 'current-score') && currentQuestionNumber < 14)

          const previousQuestions = questionBank.questions.filter(question => question.order < currentQuestionNumber).sort((a, b) => b.order ?? 0 - a.order ?? 0)

          if (previousQuestions.length > 0) {
            previousQuestions.some((question) => {
              const prevQuestionYarKey = question.yarKey
              result = !getYarValue(request, prevQuestionYarKey)
              return result
            })
          }
        }
        if (result) return h.redirect(startPageUrl)
        if (score) return h.redirect(`${urlPrefix}/project-summary`).takeover()
        return h.continue
      })
    }
  }
}
