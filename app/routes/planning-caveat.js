const urlPrefix = require('../config/server').urlPrefix

const MAYBE_ELIGIBLE = {
  backLink: `${urlPrefix}/planning-permission`,
  nextLink: `${urlPrefix}/project-start`,
  messageHeader: 'You may be able to apply for this grant',
  messageContent: 'Any planning permission must be in place by 31 December 2021 (the end of the application window).'
}

module.exports = [
  {
    method: 'GET',
    path: `${urlPrefix}/planning-required-condition`,
    handler: (request, h) => {
      return h.view('maybe-eligible', MAYBE_ELIGIBLE)
    }
  }
]
