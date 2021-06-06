const urlPrefix = require('../config/server').urlPrefix
const questions = require('../config/question-bank').questions
const sortedQs = questions.filter(q => Number.isInteger(q.order)).sort((q1, q2) => q1.order - q2.order)

module.exports = function (key) {
  const questionIndex = sortedQs.findIndex(q => q.key === key)
  const questionUrl = sortedQs[questionIndex].url
  const previousUrl = sortedQs[questionIndex - 1]?.url ?? 'start'
  const nextUrl = sortedQs[questionIndex + 1]?.url ?? 'start'

  return {
    path: `${urlPrefix}/${questionUrl}`,
    previousPath: `${urlPrefix}/${previousUrl}`,
    nextPath: `${urlPrefix}/${nextUrl}`,
    template: questionUrl,
    pathPrefix: urlPrefix
  }
}
