const config = require('../config/server').cookieOptions
const urlPrefix = require('../config/server').urlPrefix

function getCurrentPolicy (request, h) {
  let cookiesPolicy = request.state.cookies_policy
  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }
  return cookiesPolicy
}

function createDefaultPolicy (h) {
  const cookiesPolicy = { confirmed: false, essential: true, analytics: false }
  h.state('cookies_policy', cookiesPolicy, config)
  return cookiesPolicy
}

function updatePolicy (request, h, analytics) {
  let cookiesPolicy = request.state.cookies_policy

  if (!cookiesPolicy) {
    cookiesPolicy = createDefaultPolicy(h)
  }

  cookiesPolicy.analytics = analytics
  cookiesPolicy.confirmed = true

  h.state('cookies_policy', cookiesPolicy, config)
}

function validSession (request) {
  return request.state?.session
}

module.exports = {
  getCurrentPolicy,
  updatePolicy,
  validSession,
  sessionIgnorePaths: [
    `${urlPrefix}/start`,
    `${urlPrefix}/session-timeout`,
    `${urlPrefix}/cookies`,
    `${urlPrefix}/accessibility`,
    `${urlPrefix}/farming-type`,
    `${urlPrefix}/assets`,
    '/healthy',
    '/healthz',
    `${urlPrefix}/login`,
    `${urlPrefix}/confirmation`
  ]
}
