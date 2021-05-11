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
        let result = false
        if (request.response.variety === 'view' && questionBank.questions.filter(q => q.url === currentUrl).length > 0) {
          const currentQuestionOrder = questionBank.questions.filter(q => q.url === currentUrl)[0].order
          const validQuestions = questionBank.questions.filter(q => q.order < currentQuestionOrder)
            .sort((a, b) => b.order ?? 0 - a.order ?? 0)
          if (validQuestions.length > 0) {
            validQuestions.some((question) => {
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
