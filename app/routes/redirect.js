const startPageUrl = require('../config/server').startPageUrl

module.exports = {
  method: 'GET',
  path: '/{p?}',
  handler: (request, h) => h.redirect(startPageUrl)
}
