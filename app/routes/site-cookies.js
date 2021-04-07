
const { updatePolicy } = require('../cookies')
const Joi = require('joi')

function ViewModel (cookiesPolicy = {}, updated = false) {
  this.analytics = {
    idPrefix: 'analytics',
    name: 'analytics',
    fieldset: {
      legend: {
        text: 'Do you want to accept analytics cookies?',
        classes: 'govuk-fieldset__legend--s'
      }
    },
    items: [
      {
        value: true,
        text: 'Yes',
        checked: cookiesPolicy.analytics
      },
      {
        value: false,
        text: 'No',
        checked: !cookiesPolicy.analytics
      }
    ]
  }

  this.updated = updated
}
module.exports = [{
  method: 'GET',
  path: '/site-cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', new ViewModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: '/site-cookies',
  options: {
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('/site-cookies?updated=true')
    }
  }
}]
