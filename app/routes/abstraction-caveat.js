const urlPrefix = require('../config/server').urlPrefix

const MAYBE_ELIGIBLE = {
  backLink: `${urlPrefix}/abstraction-licence`,
  nextUrl: `${urlPrefix}/irrigation-status`,
  messageHeader: 'You may be able to apply for a grant from this scheme',
  messageContent: `You must have secured abstraction licences or variations before you submit a full application.`
}

module.exports = [
  {
    method: 'GET',
    path: `${urlPrefix}/abstraction-required-condition`,
    handler: (request, h) => {
      return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    }
  }
]
