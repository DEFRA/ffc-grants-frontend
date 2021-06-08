const urlPrefix = require('../config/server').urlPrefix

module.exports = {
  method: 'GET',
  path: `${urlPrefix}/session-timeout`,
  handler: function (request, h) {
    return h.view('session-timeout', { startLink: `${urlPrefix}/farming-type` })
  }
}
