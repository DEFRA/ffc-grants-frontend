
const { updatePolicy } = require('../cookies')
const Joi = require('joi')
const authConfig = require('../config/auth')

function createModel (cookiesPolicy = {}, updated = false) {
  return {
    essentialCookies: [
      [
        { text: 'cookies_policy' },
        { text: 'Saves your cookie consent settings' },
        { text: '1 year' }
      ],
      [
        { text: 'crumb' },
        { text: 'Saves your scross site scripting cookie' },
        { text: '1 year' }
      ],
      [
        { text: 'session' },
        { text: 'Saves your session' },
        { text: '1 year' }
      ],
      ...(authConfig.enabled
        ? [[
            { text: 'session-auth' },
            { text: 'Saves authentication for your session' },
            { text: '1 year' }
          ]]
        : [])
    ],
    analytics: {
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
    },
    updated
  }
}

module.exports = [{
  method: 'GET',
  path: '/site-cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', createModel(request.state.cookies_policy, request.query.updated))
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
