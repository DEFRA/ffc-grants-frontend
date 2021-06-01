const MAYBE_ELIGIBLE = {
  backLink: './planning-permission',
  nextLink: './project-start',
  messageHeader: 'You may be able to apply for this grant',
  messageContent: 'Any planning permission must be in place by 31 December 2021 (the end of the application window).'
}

module.exports = [
  {
    method: 'GET',
    path: '/planning-caveat',
    handler: (request, h) => {
      return h.view('maybe-eligible', MAYBE_ELIGIBLE).takeover()
    }
  }
]
