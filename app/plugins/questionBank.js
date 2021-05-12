/*
* Add an `onPreAuth` listener to return error pages
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
          console.log(currentQuestionNumber, 'QUESTION NUMBER')

          const previousQuestions = questionBank.questions.filter(question => question.order < currentQuestionNumber).sort((a, b) => b.order ?? 0 - a.order ?? 0)
          console.log(previousQuestions, 'VALID QUESTIONS')

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
