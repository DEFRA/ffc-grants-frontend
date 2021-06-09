const urlPrefix = require('../config/server').urlPrefix

module.exports = {
  method: 'GET',
  path: '/{p?}',
  handler: (request, h) => h.redirect(`${urlPrefix}/start`)
}
