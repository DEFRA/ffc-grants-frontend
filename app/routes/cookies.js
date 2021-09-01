const { updatePolicy } = require('../cookies')
const Joi = require('joi')
const urlPrefix = require('../config/server').urlPrefix

const viewTemplate = 'cookies/cookie-policy'
const currentPath = `${urlPrefix}/cookies`
const authConfig = require('../config/auth')

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
        },
        ...(authConfig.enabled
          ? [[
              { text: 'session-auth' },
              { text: 'Saves authentication for your session' },
              { text: '1 year' }
            ]]
          : [])
      ]
    },
    updated
  }
}

module.exports = [{
  method: 'GET',
  path: currentPath,
  handler: (request, h) => {
    return h.view(viewTemplate, createModel(request.state.cookies_policy, request.query.updated))
  }
}, {
  method: 'POST',
  path: currentPath,
  options: {
    validate: {
      payload: Joi.object({
        analytics: Joi.boolean(),
        async: Joi.boolean().default(false)
      })
    },
    handler: async (request, h) => {
      updatePolicy(request, h, request.payload.analytics)
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect(`${currentPath}?updated=true`)
    }
  }
}]
