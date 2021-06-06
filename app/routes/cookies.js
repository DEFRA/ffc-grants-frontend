const { updatePolicy } = require('../cookies')
const Joi = require('joi')

function createModel (cookiesPolicy = {}, updated = false) {
  return {
    analytics: {
      idPrefix: 'analytics',
      name: 'analytics',
      items: [
        {
          value: true,
          text: 'Use cookies that measure my website use',
          checked: cookiesPolicy.analytics
        },
        {
          value: false,
          text: 'Do not use cookies that measure my website use',
          checked: !cookiesPolicy.analytics
        }
      ]
    },
    updated
  }
}

module.exports = [{
  method: 'GET',
  path: '/cookies',
  handler: (request, h) => {
    return h.view('cookies/cookie-policy', createModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: '/cookies',
  options: {
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: async (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      await request.ga.event({
        category: 'Analytics',
        action: request.payload.analytics ? 'Accepted' : 'Rejected'
      })
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect('./cookies?updated=true')
    }
  }
}]
