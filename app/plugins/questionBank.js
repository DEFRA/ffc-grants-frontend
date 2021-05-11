/*
* Add an `onPreAuth` listener to return error pages
*/
const questionBank = require('../config/question-bank')

module.exports = {
  plugin: {
    name: 'page-guard',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const currentUrl = request?.headers?.referer?.split('/').pop()
        let result = false
        if (request.response.variety === 'view') {
          questionBank.questions.forEach((question, index) => {
            let previousIndex = index - 1 > 0 ? index - 1 : 0
            const previousUrl = questionBank.questions[previousIndex].url
            const prevQuestionYarKey = questionBank.questions[previousIndex].yarKey
            if (index > 0 && question.url === currentUrl) {
              if (previousUrl === currentUrl) previousIndex--
              if (!request.yar.get(prevQuestionYarKey)) result = true
            }
          })
        }
        console.log(result, 'RRRRRRR')
        if (result) return h.view('500')
        return h.continue
      })
    }
  }
}
