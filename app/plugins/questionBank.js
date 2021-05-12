/*
* Add an `onPreResponse` listener to add page guard for scoring questions
*/
const questionBank = require('../config/question-bank')

module.exports = {
  plugin: {
    name: 'page-guard',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const currentUrl = request.url.pathname.toLowerCase().split('/').pop()
        let result

        if (request.response.variety === 'view' && questionBank.questions.filter(question => question.url === currentUrl).length > 0) {
          const currentQuestionNumber = questionBank.questions.filter(question => question.url === currentUrl)[0].order

          const previousQuestions = questionBank.questions.filter(question => question.order < currentQuestionNumber).sort((a, b) => b.order ?? 0 - a.order ?? 0)

          if (previousQuestions.length > 0) {
            previousQuestions.some((question) => {
              const prevQuestionYarKey = question.yarKey
              result = !request.yar.get(prevQuestionYarKey)
              return result
            })
          }
        }
        if (result) return h.redirect('/start')
        return h.continue
      })
    }
  }
}
