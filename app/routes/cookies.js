const { updatePolicy } = require('../cookies')
const Joi = require('joi')
const urlPrefix = require('../config/server').urlPrefix
const gapiService = require('../services/gapi-service')


const viewTemplate = 'cookies/cookie-policy'
const currentPath = `${urlPrefix}/cookies`

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
      await gapiService.sendDimensionOrMetric(request, {
        dimensionOrMetric: gapiService.dimensions.ANALYTICS,
        value: request.payload.analytics ? 'Accepted' : 'Rejected'
      })
      if (request.payload.async) {
        return h.response('ok')
      }
      return h.redirect(`${currentPath}?updated=true`)
    }
  }
}]
