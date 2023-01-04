/*
* Add an `onPreResponse` listener to add page guard for scoring questions
*/
const questionBank = require('../config/question-bank')
const { getYarValue } = require('../helpers/session')
const { urlPrefix, startPageUrl, serviceEndDate, serviceEndTime } = require('../config/server')

module.exports = {
  plugin: {
    name: 'page-guard',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const currentUrl = request.url.pathname.split('/').pop()
        let result
        let score
        let skipIrrigationStatus
        const today = new Date(new Date().toDateString())
        const decomissionServiceDate = new Date(serviceEndDate)
        const time = new Date().toLocaleTimeString('it-IT')
        const dateExpired = +today > +decomissionServiceDate
        const expiringToday = (+today === +decomissionServiceDate) && (time > serviceEndTime)
        const serviceDecommissioned = expiringToday || dateExpired

        if (request.response.variety === 'view' && questionBank.questions.filter(question => question.url === currentUrl).length > 0) {
          const currentQuestionNumber = questionBank.questions.filter(question => question.url === currentUrl)[0].order
          skipIrrigationStatus = (getYarValue(request, 'current-score') && currentUrl === 'irrigation-status')
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
        if (request.response.variety === 'view' && request.url.pathname !== startPageUrl && currentUrl !== 'login' && serviceDecommissioned) return h.redirect(startPageUrl)
        if (result) return h.redirect(startPageUrl)
        if (score) return h.redirect(`${urlPrefix}/project-summary`).takeover()
        if (skipIrrigationStatus) return h.redirect(`${urlPrefix}/irrigated-land`).takeover()

        return h.continue
      })
    }
  }
}
